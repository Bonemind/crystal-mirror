require "yaml"
def get_env
   env = "development"
   env = ENV["KEMAL_ENV"] if ENV["KEMAL_ENV"]?
   return env
end

def get_current_config
   env = get_env
   return get_env_config(env)
end

def get_env_config(env)
   config = YAML.parse(File.read("./config/db.yml"))
   env_config = config[env]
   return env_config
end
