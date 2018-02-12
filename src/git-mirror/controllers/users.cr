require "kemal"
require "../models/repo"
require "../models/user"

get "/users" do
   users = Repo.all(User)
   users.as(Array).to_json
end

post "/users" do |env|
   user = User.new
   user.name = env.params.json["name"].as(String)
   user.password = env.params.json["password"].as(String)
   Repo.insert(user)
   next user.to_json
end
