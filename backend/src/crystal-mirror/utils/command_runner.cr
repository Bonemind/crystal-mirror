require "io"

# Named tuple containing command results
alias CommandResult = NamedTuple(
   command: String,
   output: String,
   error: String,
   status: Int32
)


# Commandrunner, accepts a hash containing env vars that should
# be set for every command
class CommandRunner
   def initialize(env : Hash(String, String) = {} of String => String)
      @env = env
   end


   # Runs a list of commands
   # Breaks if a command fails (returns nonzero exit code)
   def run_command_list(command_list, target_dir)
      results = [] of CommandResult
      command_list.each do |c|
         results << run_command(c, target_dir)
         break if results[-1][:status] > 0
      end
      return results
   end

   # Actual command runner
   # Runs commands in a certain dir, with the env as configured
   def run_command(command, dir)
      output = IO::Memory.new
      error = IO::Memory.new
      status = Process.run("sh", {"-c", command}, env: @env, output: output, error: error, chdir: dir)
      result = {
         command: command,
         output: output.to_s,
         error: error.to_s,
         status: status.exit_status
      }
      output.close
      error.close
      return result
   end
end
