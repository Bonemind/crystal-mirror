require "pg"
require "crecto"
require "../utils/config_reader"

module Repo
   extend Crecto::Repo

   config do |conf|
      env_config = get_current_config
      dbconf = env_config["db"]
      conf.adapter = Crecto::Adapters::Postgres
      conf.database = dbconf["database"].as_s
      conf.hostname = dbconf["host"].as_s
      conf.username = dbconf["user"].as_s
      conf.password = dbconf["password"].as_s
      conf.port = dbconf["port"].as_i
      # you can also set initial_pool_size, max_pool_size, max_idle_pool_size,
      # checkout_timeout, retry_attempts, and retry_delay
   end
end
