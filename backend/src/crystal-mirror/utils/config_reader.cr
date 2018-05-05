require "yaml"
require "dispatch"

# Gets the env we're running in, and defaults to development
def get_env
   env = "development"
   env = ENV["KEMAL_ENV"] if ENV["KEMAL_ENV"]?
   return env
end

# Simple wrapper to get current config block
def get_current_config
   env = get_env
   return get_env_config(env)
end

# Get the relevant config block
def get_env_config(env)
   config = YAML.parse(File.read("./config.yml"))
   env_config = config[env]
   return env_config
end

# Configure dispatch based on config
def configure_dispatch
   conf = get_current_config

   Dispatch.configure do |config|
      config.num_workers = conf["dispatch"]["workers"].as_i
      config.queue_size = conf["dispatch"]["queue_size"].as_i
      config.logger = Logger.new(IO::Memory.new)
   end
end
