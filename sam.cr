require "pg"
require "sam"
require "migrate"
require "./src/git-mirror/utils/config_reader"
require "./src/git-mirror/tasks/sync"
require "./src/git-mirror/models/repo"
require "./src/git-mirror/models/repository"
require "./src/git-mirror/models/user"
require "dispatch"
require "io"
require "crypto/bcrypt/password"
require "yaml"

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

Sam.namespace "db" do
   config = get_current_config
   dbconfig = config["db"]
   migrator = Migrate::Migrator.new(
      DB.open("postgresql://#{dbconfig["user"]}:#{dbconfig["password"]}@#{dbconfig["host"]}/#{dbconfig["database"]}"),
      Logger.new(STDOUT),
      File.join("migrations"), # Path to migrations
      "version", # Version table name
      "version" # Version column name
   )

   task "migrate" do
      migrator.to_latest
   end

   task "rollback" do
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
      user = Repo.insert(user).instance
      user.create_ssh_key(config["ssh"]["keys_dir"])
      puts "Created user, assigned id: #{user.id}"
   end
end

Sam.help
