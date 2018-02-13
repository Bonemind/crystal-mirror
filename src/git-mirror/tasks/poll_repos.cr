require "../models/repo"
require "../models/repository"
require "io"
require "file_utils"

def run_command(command, dir)
   output = IO::Memory.new
   error = IO::Memory.new
   status = Process.run("sh", {"-c", command}, output: output, error: error, chdir: dir)
   result = { output: output.to_s, error: error.to_s, status: status.exit_status }
   output.close
   error.close
   return result
end

def sync_all
   repos = Repo.all(Repository)
   repos.each do |r|
      puts r.from_url
      puts r.to_url

      ssh_command = "GIT_SSH_COMMAND='ssh -i /tmp/sshtest/1 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'"

      target_dir = "/tmp/#{r.id}"

      # Remove the directory if it exists
      # Makes sure we start with a clean repo
      if Dir.exists?(target_dir)
         FileUtils.rm_r(target_dir)
      end
      Dir.mkdir_p(target_dir)

      # Bare clone, see https://help.github.com/articles/duplicating-a-repository/
      git_command = "git clone --bare #{r.from_url} ./"
      result = run_command("#{ssh_command} #{git_command}", target_dir)
      puts result

      # Push to new upstream
      git_push_command = "git push --mirror #{r.to_url}"
      result = run_command("#{ssh_command} #{git_push_command}", target_dir)
      puts result
   end
end
