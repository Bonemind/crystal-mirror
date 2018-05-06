require "pg"
require "sam"
require "migrate"
require "./src/crystal-mirror/utils/config_reader"
require "./src/crystal-mirror/tasks/sync"
require "./src/crystal-mirror/models/repo"
require "./src/crystal-mirror/models/repository"
require "./src/crystal-mirror/models/user"
require "dispatch"
require "io"
require "crypto/bcrypt/password"
require "yaml"

MIGRATION_RETRIES = 3

def wait_for_dispatch
   # Wait for dispatch to finish
   # Sam tasks would exit before our fibers have done their work otherwise
   job_channel = Dispatch::Dispatcher.instance.job_queue
   while !job_channel.empty?
      puts "Still syncing"
      sleep 3
   end
end

configure_dispatch

def get_migrator
   config = get_current_config
   dbconfig = config["db"]
   migrator = Migrate::Migrator.new(
      DB.open("postgresql://#{dbconfig["user"]}:#{dbconfig["password"]}@#{dbconfig["host"]}:#{dbconfig["port"]}/#{dbconfig["database"]}"),
      Logger.new(STDOUT),
      File.join("migrations"), # Path to migrations
      "version", # Version table name
      "version" # Version column name
   )
   return migrator
end

Sam.namespace "db" do

   task "migrate" do
      retries = 0
      # Retry a few times, giving postgres the time to start
      # when in a docker-compose env
      while retries < MIGRATION_RETRIES
         begin
            migrator = get_migrator
            migrator.to_latest
            break
         rescue ex
            retries += 1
            puts ex.message
            puts "Migration failed, retrying in 5 seconds..." unless retries >= MIGRATION_RETRIES
            sleep 5
         end
         puts "Couldn't migrate"
      end
   end

   task "rollback" do
      migrator = get_migrator
      migrator.down
   end
end

Sam.namespace "repos" do
   task "sync" do |t, args|
      user = args.named["user"]
      config = get_current_config
      sync_all(config["ssh"]["keys_dir"].as_s, config["git"]["repo_dir"].as_s)
      wait_for_dispatch
   end

   task "sync_by_id" do |t, args|
      id = args.named["id"].to_i

      config = get_current_config
      sync_repo(id, config["ssh"]["keys_dir"].as_s, config["git"]["repo_dir"].as_s)
      wait_for_dispatch
   end

   task "schedule_polls" do
      config = get_current_config
      schedule_polls(config["ssh"]["keys_dir"].as_s, config["git"]["repo_dir"].as_s)
      wait_for_dispatch
   end
end

Sam.namespace "user" do
   task "create" do |t, args|
      config = get_current_config
      username = args.named["username"].to_s
      password = args.named["password"].to_s

      user = User.new
      user.name = username
      user.password = Crypto::Bcrypt::Password.create(password).to_s
      user.is_admin = true
      user = Repo.insert(user).instance
      user.create_ssh_key(config["ssh"]["keys_dir"])
      puts "Created user, assigned id: #{user.id}"
   end
end

Sam.help
