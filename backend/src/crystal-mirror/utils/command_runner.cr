require "io"

alias CommandResult = NamedTuple(
   command: String,
   output: String,
   error: String,
   status: Int32
)


class CommandRunner
   def initialize(env : Hash(String, String) = {} of String => String)
      @env = env
   end


   def run_command_list(command_list, target_dir)
      results = [] of CommandResult
      command_list.each do |c|
         results << run_command(c, target_dir)
         break if results[-1][:status] > 0
      end
      return results
   end

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
