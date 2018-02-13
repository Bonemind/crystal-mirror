require "pg"
require "sam"
require "migrate"
require "./src/git-mirror/tasks/sync"
require "dispatch"
require "io"

Dispatch.configure do |config|
  config.num_workers = 5
  config.queue_size = 10
  config.logger = Logger.new(IO::Memory.new)
end

Sam.namespace "db" do
  migrator = Migrate::Migrator.new(
     DB.open("postgresql://crystal:crystal@localhost/crystal"),
     Logger.new(STDOUT),
     File.join("migrations"), # Path to migrations
     "version", # Version table name
     "version" # Version column name
  )

  task "migrate" do
    puts "migrating"
    puts File.join("migrations")
    migrator.to_latest
  end

  task "rollback" do
     migrator.down
  end
end

Sam.namespace "repos" do
   task "sync" do
      sync_all
   end

   task "sync_all_async" do
      SyncAllTask.dispatch
      sleep 10
   end

   task "sync_by_id" do |t, args|
      sync_repo(args.named["id"].to_i)
   end
end

Sam.help
