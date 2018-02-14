require "pg"
require "sam"
require "migrate"
require "./src/git-mirror/utils/config_reader"
require "./src/git-mirror/tasks/sync"
require "dispatch"
require "io"
require "yaml"

Dispatch.configure do |config|
   config.num_workers = 5
   config.queue_size = 10
   config.logger = Logger.new(IO::Memory.new)
end

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
      sync_all(config["shh"]["keys_dir"].as_s, config["git"]["repo_dir"].as_s)
   end

   task "sync_by_id" do |t, args|
      id = args.named["id"].to_i

      config = get_current_config
      sync_repo(id, config["ssh"]["keys_dir"].as_s, config["git"]["repo_dir"].as_s)
   end
end

Sam.namespace "test" do
   task "parse_yaml" do
      puts YAML.parse(File.read("./config/db.yml"))
   end
end

Sam.help
