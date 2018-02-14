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
   puts repo.from_url
   puts repo.to_url

   ssh_command = "GIT_SSH_COMMAND='ssh -i #{ssh_key_path}/#{repo.user_id} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'"

   target_dir = "#{git_dir}/#{repo.id}"
   # Remove the directory if it exists
   # Makes sure we start with a clean repo
   if Dir.exists?(target_dir)
      FileUtils.rm_r(target_dir)
   end
   Dir.mkdir_p(target_dir)

   # Bare clone, see https://help.github.com/articles/duplicating-a-repository/
   git_command = "git clone --bare #{repo.from_url} ./"
   result = run_command("#{ssh_command} #{git_command}", target_dir)
   puts result

   # Push to new upstream
   git_push_command = "git push --mirror #{repo.to_url}"
   result = run_command("#{ssh_command} #{git_push_command}", target_dir)
   puts result
end

def sync_all(ssh_key_path, git_root_dir)
   repos = Repo.all(Repository)
   repos.each do |r|
      sync_repo(r, ssh_key_path, git_root_dir)
   end
end

class SyncAllTask
   include Dispatchable

   def perform(ssh_key_path, git_root_dir)
      sync_all
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
