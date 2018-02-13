require "./git-mirror/*"
require "./git-mirror/controllers/*"
require "./git-mirror/middleware/*"
require "kemal"
require "crecto"
require "quartz"


token_auth

# Execute block every second
Quartz::PeriodicTimer.new(1) do
end


Kemal.run


