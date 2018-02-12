require "uuid"
require "kemal"
require "crypto/bcrypt/password"
require "../models/repo"
require "../models/user"
require "../models/token"

get "/users" do |env|
   env.response.content_type = "application/json"
   users = Repo.all(User)
   users.as(Array).to_json
end

post "/users" do |env|
   env.response.content_type = "application/json"
   user = User.new
   user.name = env.params.json["name"].as(String)
   input_password = env.params.json["password"].as(String)
   user.password = Crypto::Bcrypt::Password.create(input_password, cost: 10).to_s
   user = Repo.insert(user).instance
   next user.to_json
end

put "/users/:id" do |env|
   env.response.content_type = "application/json"
   user = Repo.get(User, env.params.url["id"].to_i)
   if user.nil?
      halt env, status_code: 404, response: {message: "Not found"}.to_json
   end
   if env.params.json["name"]?
      user.name = env.params.json["name"].as(String)
   end

   if env.params.json["password"]?
      user.password = Crypto::Bcrypt::Password.create(
         env.params.json["password"].as(String), cost: 10
      ).to_s
   end
   user = Repo.update(user).instance
   next user.to_json
end

delete "/users/:id" do |env|
   env.response.content_type = "application/json"
   user = Repo.get(User, env.params.url["id"].to_i)
   puts user.id unless user.nil?
   puts user.name unless user.nil?
   user = user.as(User) unless user.nil?
   if user.nil?
      halt env, status_code: 404, response: {message: "Not found"}.to_json
   end
   Repo.delete(user)
   env.response.status_code = 204
end