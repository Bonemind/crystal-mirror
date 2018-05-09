require "../models/repo"
require "../models/repository"
require "../utils/command_runner"
require "../utils/config_reader"
require "io"
require "file_utils"
require "dispatch"

# Sync a single repo
# Overload to allow syncing by id
def sync_repo(id : Int64 | Int32 | Nil, ssh_key_path, git_dir)
   return if id.nil?
   repo = Repo.get(Repository, id)
   return if repo.nil?
   repo = repo.as(Repository)
   sync_repo(repo, ssh_key_path, git_dir)
end

# The actual sync function
def sync_repo(repo : Repository, ssh_key_path, git_dir)
   # Check if we have an ssh key
   ssh_keyfile_path = "#{ssh_key_path}/#{repo.user_id}"
   unless File.exists?(ssh_keyfile_path)
      puts "Missing ssh key: #{ssh_keyfile_path}"
      commandresult = Commandresult.new
      commandresult.output = "Missing ssh key"
      commandresult.status = 1
      commandresult.repository = repo
      Repo.insert(commandresult)
      return
   end

   # Git ssh command
   ssh_command = "ssh -i #{ssh_keyfile_path} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=error"

   target_dir = "#{git_dir}/#{repo.id}"

   # Create a commandrunner with the git ssh command in the env
   # This allows us to define which ssh-key is used for a git command
   command_runner = CommandRunner.new({"GIT_SSH_COMMAND" => ssh_command})


   # Create our new git dir if necessary
   unless Dir.exists?(target_dir)
      Dir.mkdir_p(target_dir)
   end

   commands = [] of String | PreparedCommand
   # If we already have a repo, update the urls just in case
   if Dir.exists?("#{target_dir}/.git")
      commands << {
         command_string: "git remote set-url remote1 \"$REPO1\"",
         vars: {"REPO1" => repo.from_url.not_nil!}
      }
      commands << {
         command_string: "git remote set-url remote2 \"$REPO2\"",
         vars: {"REPO2" => repo.to_url.not_nil!}
      }
   else
      # If we don't, clone the repo and configure urls
      commands << {
         command_string: "git clone \"$REPO1\" ./",
         vars: {"REPO1" => repo.from_url.not_nil!}
      }
      commands << {
         command_string: "git remote add remote1 \"$REPO1\"",
         vars: {"REPO1" => repo.from_url.not_nil!}
      }
      commands << {
         command_string: "git remote add remote2 \"$REPO2\"",
         vars: {"REPO2" => repo.to_url.not_nil!}
      }
      commands << "git remote rm origin"
   end

   # Fetch and prune, this includes tags
   commands << "git fetch -pP remote1"

   # Push to new upstream
   commands << "git push --prune remote2 +refs/remotes/remote1/*:refs/heads/* +refs/tags/*:refs/tags/*"
   results = command_runner.run_command_list(commands, target_dir)

   # Concat the output of all commands to a single string
   total_log = ""
   total_status = 0
   results.each do |r|
      total_log += "> #{r[:command]}\n"
      total_log += "#{r[:output]}\n"
      total_log += "#{r[:error]}\n"
      total_status += r[:status]
   end

   # Save the results
   commandresult = Commandresult.new
   commandresult.output = total_log
   commandresult.status = total_status
   commandresult.repository = repo
   Repo.insert(commandresult)
end

# Helper to sunc all repos at once
def sync_all(ssh_key_path, git_root_dir)
   repos = Repo.all(Repository)
   repos.each do |r|
      sync_repo(r, ssh_key_path, git_root_dir)
   end
end

# Schedule any repos that need polling to poll
# Polling handled in separate fibers
def schedule_polls(ssh_key_path, git_root_dir)
   repositories = Repo.all(Repository).as(Array)

   repositories.each do |r|
      last_result = r.last_result
      if r.poll_interval == 0
         # Polling disabled, skip
         next
      elsif last_result.nil?
         # We want to poll and have never successfully polled, poll
         SyncRepoTask.dispatch(r, ssh_key_path, git_root_dir)
      elsif (Time.now - last_result.created_at.not_nil!).total_minutes > r.poll_interval.not_nil!.to_i
         # Our last poll is older than our defined interval, poll
         SyncRepoTask.dispatch(r, ssh_key_path, git_root_dir)
      end
   end
end


# Task wrappers for dispatch
class SyncAllTask
   include Dispatchable

   def perform(ssh_key_path, git_root_dir)
      sync_all
   end
end

class SchedulePollsTask
   include Dispatchable

   def perform(ssh_key_path, git_root_dir)
      schedule_polls(ssh_key_path, git_root_dir)
   end
end

class SyncRepoTask
   include Dispatchable

   def perform(repo : Repository, ssh_key_path, git_dir)
      sync_repo(repo, ssh_key_path, git_dir)
   end

   def perform(id, ssh_key_path, git_dir)
      sync_repo(id, ssh_key_path, git_dir)
   end
end
