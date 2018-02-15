require "io"

def run_command(command, dir)
   output = IO::Memory.new
   error = IO::Memory.new
   status = Process.run("sh", {"-c", command}, output: output, error: error, chdir: dir)
   result = { output: output.to_s, error: error.to_s, status: status.exit_status }
   output.close
   error.close
   return result
end

