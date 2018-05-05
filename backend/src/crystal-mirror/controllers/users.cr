require "uuid"
require "kemal"
require "crypto/bcrypt/password"
require "../models/repo"
require "../models/user"
require "../models/token"
require "../utils/validator"
require "../utils/response_macros"


# Validates whether the user can access the requested resouce
# gets passed in the env and the id of the owning user
macro check_is_user_resource(env, id)
   if env.current_user.nil?
      forbidden(env)
   end
   current_user = env.current_user.not_nil!

   unless current_user.is_admin || {{id}} == current_user.id
      forbidden(env)
   end
end

# Fetches a user if the logged in user should have access
macro get_user_resource
   user = Repo.get(User, env.params.url["id"].to_i)
   not_found(env) if user.nil?
   check_is_user_resource(env, user.id)
   user = user.as(User)
end


# List users, only for admins
get "/users" do |env|
   env.response.content_type = "application/json"
   forbidden(env) unless env.current_user.not_nil!.is_admin
   users = Repo.all(User)
   users.as(Array).to_json
end

# Get user data, only for admins or the own user
get "/users/:id" do |env|
   env.response.content_type = "application/json"
   user = Nil
   get_user_resource
   next user.to_json
end

# Create a user, only for admins
post "/users" do |env|
   env.response.content_type = "application/json"
   forbidden(env) unless env.current_user.not_nil!.is_admin
   user = User.new
   filtered = filter_hash(env.params.json, ["name", "password", "is_admin"])
   user.name = filtered["name"]
   user.password = Crypto::Bcrypt::Password.create(filtered["password"]).to_s
   validate_model(user, User)
   user = Repo.insert(user)
   validate_changeset(user)
   user.instance.create_ssh_key(Kemal.config.env_config["ssh"]["keys_dir"])
   next user.instance.to_json
end

# Get a users repos
get "/users/:id/repositories" do |env|
   env.response.content_type = "application/json"
   user = Nil
   get_user_resource

   repositories = Repo.get_association(user, :repositories).as(Array)
   next repositories.to_json
end

# Get the public key of the user, useful to actually sync repos
# This allows every user to have a separate key
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

# Force ssh key regen
post "/users/:id/ssh_key" do |env|
   env.response.content_type = "application/json"
   user = Nil
   get_user_resource

   keyfile_dir = Kemal.config.env_config["ssh"]["keys_dir"].as_s

   password = ""
   password = filter_hash(env.params.json, ["password"])["password"]
   user_password = Crypto::Bcrypt::Password.new(user.password.not_nil!)

   unless user_password == password
      halt env, status_code: 400, response: { message: "Invalid or missing password" }.to_json
   end

   user.create_ssh_key(keyfile_dir)
   file_contents = File.read("#{keyfile_dir}/#{user.id}.pub")
   next { public_key: file_contents }.to_json
end


# Update a user, allows admins to create more admins
# Users to update their password
put "/users/:id" do |env|
   env.response.content_type = "application/json"

   user = Nil
   current_user = env.current_user.not_nil!
   get_user_resource

   filtered = filter_hash(env.params.json, ["name", "password", "is_admin"])

   if filtered.has_key?("password") && !filtered["password"].empty?
      unless current_user.is_admin
         current_password = env.params.json.fetch("password_confirm", "").to_s
         user_password = Crypto::Bcrypt::Password.new(current_user.password.not_nil!)
         next halt env, status_code: 400, response: ({ message: "Invalid password" }).to_json unless user_password == current_password
      end
      hashed = Crypto::Bcrypt::Password.create(filtered["password"], cost: 10).to_s
      filtered["password"] = hashed
   end
   if filtered.has_key?("is_admin") && !env.current_user.not_nil!.is_admin
      filtered.delete("is_admin")
   end
   user.update_from_hash(filtered)
   user = Repo.update(user)
   validate_changeset(user)
   next user.instance.to_json
end

# Delete a user
delete "/users/:id" do |env|
   env.response.content_type = "application/json"

   user = Nil
   get_user_resource

   Repo.delete(user)
   env.response.status_code = 204
end
