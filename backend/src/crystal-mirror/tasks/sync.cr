require "../models/repo"
require "../models/repository"
require "../utils/command_runner"
require "../utils/config_reader"
require "io"
require "file_utils"
require "dispatch"

def sync_repo(id : Int64 | Int32 | Nil, ssh_key_path, git_dir)
   return if id.nil?
   repo = Repo.get(Repository, id)
   return if repo.nil?
   repo = repo.as(Repository)
   sync_repo(repo, ssh_key_path, git_dir)
end

def sync_repo(repo : Repository, ssh_key_path, git_dir)
   ssh_keyfile_path = "#{ssh_key_path}/#{repo.user_id}"
   unless File.exists?(ssh_keyfile_path)
      puts "Missing ssh key: #{ssh_keyfile_path}"
      return
   end

   ssh_command = "ssh -i #{ssh_keyfile_path} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"

   target_dir = "#{git_dir}/#{repo.id}"

   command_runner = CommandRunner.new({"GIT_SSH_COMMAND" => ssh_command})


   # Create our new git dir if necessary
   unless Dir.exists?(target_dir)
      Dir.mkdir_p(target_dir)
   end

   commands = [] of String
   # Clone and configure the remotes if needed
   unless Dir.exists?("#{target_dir}/.git")
      commands << "git clone #{repo.from_url} ./"
      commands << "git remote add remote1 #{repo.from_url}"
      commands << "git remote add remote2 #{repo.to_url}"
      commands << "git remote rm origin"
   else
      commands = [] of String
      commands << "git remote set-url remote1 #{repo.from_url}"
      commands << "git remote set-url remote2 #{repo.to_url}"
   end

   commands << "git fetch -pP remote1"

   # Push to new upstream
   commands << "git push --all remote2"
   results = command_runner.run_command_list(commands, target_dir)
   total_log = ""

   total_status = 0
   results.each do |r|
      total_log += "> #{r[:command]}\n"
      total_log += "#{r[:output]}\n"
      total_log += "#{r[:error]}\n"
      total_status += r[:status]
   end
   commandresult = Commandresult.new
   commandresult.output = total_log
   commandresult.status = total_status
   commandresult.repository = repo
   Repo.insert(commandresult)
end

def sync_all(ssh_key_path, git_root_dir)
   repos = Repo.all(Repository)
   repos.each do |r|
      sync_repo(r, ssh_key_path, git_root_dir)
   end
end

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
      elsif (Time.now - last_result.created_at.not_nil!).total_minutes > r.poll_interval.not_nil!
         # Our last poll is older than our defined interval, poll
         SyncRepoTask.dispatch(r, ssh_key_path, git_root_dir)
      end
   end
end


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
