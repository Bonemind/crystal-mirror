require "uuid"
require "kemal"
require "crypto/bcrypt/password"
require "../models/repo"
require "../models/user"
require "../models/token"
require "../utils/validator"
require "../utils/response_macros"

macro get_user_resource
   user = Repo.get(User, env.params.url["id"].to_i)
   not_found(env) if user.nil?
   check_is_user_resource(env, user.id)
   user = user.as(User)
end

get "/users" do |env|
   env.response.content_type = "application/json"
   users = Repo.all(User)
   users.as(Array).to_json
end

get "/users/:id" do |env|
   env.response.content_type = "application/json"
   user = Nil
   get_user_resource
   next user.to_json
end

post "/users" do |env|
   env.response.content_type = "application/json"
   user = User.new
   user.name = env.params.json["name"].as(String)
   input_password = env.params.json["password"].as(String)
   user.password = Crypto::Bcrypt::Password.create(input_password).to_s
   validate_model(user, User)
   puts User.changeset(user).valid?
   user = Repo.insert(user)
   validate_changeset(user)
   user.instance.create_ssh_key(Kemal.config.env_config["ssh"]["keys_dir"])
   next user.instance.to_json
end

get "/users/:id/repositories" do |env|
   env.response.content_type = "application/json"
   user = Nil
   get_user_resource

   repositories = Repo.get_association(user, :repositories).as(Array)
   next repositories.to_json
end

get "/users/:id/ssh_key" do |env|
   env.response.content_type = "application/json"
   user = Nil
   get_user_resource
   keyfile_path = Kemal.config.env_config["ssh"]["keys_dir"].as_s + "/#{user.id}.pub"

   unless File.exists?(keyfile_path)
      not_found(env)
   end

   file_contents = File.read(keyfile_path)
   next { public_key: file_contents }.to_json
end

post "/users/:id/ssh_key" do |env|
   env.response.content_type = "application/json"
   user = Nil
   get_user_resource

   keyfile_dir = Kemal.config.env_config["ssh"]["keys_dir"].as_s

   password = ""
   password = env.params.json["password"].as(String) if env.params.json["password"]?
   user_password = Crypto::Bcrypt::Password.new(user.password.not_nil!)

   unless user_password == password
      halt env, status_code: 400, response: { message: "Invalid or missing password" }.to_json
   end

   user.create_ssh_key(keyfile_dir)
   file_contents = File.read("#{keyfile_dir}/#{user.id}.pub")
   next { public_key: file_contents }.to_json
end


put "/users/:id" do |env|
   env.response.content_type = "application/json"

   user = Nil
   get_user_resource

   if env.params.json["name"]?
      user.name = env.params.json["name"].as(String)
   end

   if env.params.json["password"]?
      user.password = Crypto::Bcrypt::Password.create(
         env.params.json["password"].as(String), cost: 10
      ).to_s
   end
   user = Repo.update(user)
   validate_changeset(user)
   next user.instance.to_json
end

delete "/users/:id" do |env|
   env.response.content_type = "application/json"

   user = Nil
   get_user_resource

   Repo.delete(user)
   env.response.status_code = 204
end