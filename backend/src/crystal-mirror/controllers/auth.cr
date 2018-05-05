require "uuid"
require "kemal"
require "crypto/bcrypt/password"
require "../models/repo"
require "../models/user"
require "../models/token"
require "../utils/validator"

# Helper to easily throw 401
macro halt_401(env)
   env.response.content_type = "application/json"
   halt env, status_code: 401, response: ({ message: "Invalid username or password" }).to_json
end

# Delete the token used to make the request, logging a user out
delete "/auth/logout" do |env|
   env.response.content_type = "application/json"
   user = env.current_user.not_nil!
   tokens = Repo.get_association(user, :tokens).as(Array)
   tokens.each do |token|
      Repo.delete(token)
   end
   env.response.content_type = "application/json"
   env.response.status_code = 204
end

# Log a user in, returns a token
post "/auth/login" do |env|
   unless env.params.json["name"]? && env.params.json["password"]?
      halt env, status_code: 400, response: {message: "Both name and password are required"}.to_json
   end
   cleaned = filter_hash(env.params.json, ["name", "password"])
   user = Repo.get_by(User, name: cleaned["name"])
   if user.nil?
      halt_401 env
   end
   user = user.as(User) unless user.nil?
   user_password = Crypto::Bcrypt::Password.new(user.password.not_nil!)
   halt_401 env unless user_password == cleaned["password"]

   env.response.content_type = "application/json"
   token = user.create_token
   token_user = Repo.get_association(token, :user).as(User)
   token.user = token_user
   next token.to_json
end

# Allows a user to discover their own data
get "/auth/me" do |env|
   env.response.content_type = "application/json"
   user = env.current_user.not_nil!
   next user.to_json
end
