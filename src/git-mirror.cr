require "./git-mirror/*"
require "./git-mirror/controllers/*"
require "./git-mirror/middleware/*"
require "./git-mirror/utils/config_reader"
require "kemal"
require "crecto"
require "quartz"
require "yaml"

module Kemal
	class Config
		@env_config = YAML.parse("")
		property env_config
	end
end

token_auth

puts "Current env: #{get_env}"
env_config = get_env_config(Kemal.config.env)
Kemal.config.env_config = env_config

configure_dispatch

# Execute block every second
Quartz::PeriodicTimer.new(60) do
	# Schedule any repos for polling that need it
	# TODO: probably useful to introduce some kind of lock
	SchedulePollsTask.dispatch(
		env_config["ssh"]["keys_dir"].as_s,
		env_config["git"]["repo_dir"].as_s
	)
end


Kemal.run


