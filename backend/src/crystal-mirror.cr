require "./crystal-mirror/*"
require "./crystal-mirror/controllers/*"
require "./crystal-mirror/middleware/*"
require "./crystal-mirror/utils/config_reader"
require "kemal"
require "crecto"
require "quartz"
require "yaml"

# Seconds between checks to see if we need to poll a repo
POLL_CHECK_INTERVAL = 60

module Kemal
   # Mixin to store env in request context
	class Config
		@env_config = YAML.parse("")
		property env_config
	end
end

# Middleware
token_auth
cors_middleware

# Dump env and read the config for the current env
puts "Current env: #{get_env}"
current_env = get_env
env_config = get_env_config(current_env)
Kemal.config.env_config = env_config

configure_dispatch

# Execute block every minute
Quartz::PeriodicTimer.new(POLL_CHECK_INTERVAL) do
	# Schedule any repos for polling that need it
	# TODO: probably useful to introduce some kind of lock
	SchedulePollsTask.dispatch(
		env_config["ssh"]["keys_dir"].as_s,
		env_config["git"]["repo_dir"].as_s
	)
end


# Start kemal on the defined port
Kemal.run(Kemal.config.env_config["web"]["port"].as_i)
