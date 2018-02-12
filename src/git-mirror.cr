require "./git-mirror/*"
require "./git-mirror/controllers/*"
require "kemal"
require "crecto"

get "/" do
   "Hello world"
end

Kemal.run


