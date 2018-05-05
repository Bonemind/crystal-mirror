require "crecto"
require "./token"
require "./repository"
require "../utils/command_runner"
require "../utils/jsonifier"

class User < Crecto::Model
   schema "users" do
      field :name, String
      field :password, String
      field :is_admin, Bool, default: false
      has_many :tokens, Token, dependent: :destroy
      has_many :repositories, Repository, dependent: :destroy
   end

   # Creates a login token
   def create_token
      token = Token.new
      token.uuid = UUID.random.to_s
      token.user = self
      token = Repo.insert(token).instance
      return token
   end

   # Creates this user's ssh key
   # Recreates if it already exists
   def create_ssh_key(path)
      command_runner = CommandRunner.new()
      key_file = "#{path}/#{self.id}"
      File.delete(key_file) if File.exists?(key_file)
      File.delete("#{key_file}.pub") if File.exists?("#{key_file}.pub")
      command_runner.run_command("ssh-keygen -f #{self.id} -P \"\"", "#{path}")
   end

   jsonifier(include_names: ["id", "name", "is_admin"])

   validate_required [:name, :password]
   unique_constraint :name
end
