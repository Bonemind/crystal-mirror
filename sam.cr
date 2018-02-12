require "pg"
require "sam"
require "migrate"

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

Sam.help
