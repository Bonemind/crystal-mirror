require "./git-mirror/*"
require "./git-mirror/controllers/*"
require "./git-mirror/middleware/*"
require "kemal"
require "crecto"

token_auth

get "/" do
   "Hello world"
end

Kemal.run


