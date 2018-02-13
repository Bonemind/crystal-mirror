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

get "/config" do |env|
	env.response.content_type = "application/json"
	next {a: "b"}.to_json
end


token_auth

puts "Current env: #{get_env}"
env_config = get_env_config(Kemal.config.env)
Kemal.config.env_config = env_config

# Execute block every second
Quartz::PeriodicTimer.new(1) do
end


Kemal.run


