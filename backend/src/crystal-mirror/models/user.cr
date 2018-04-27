require "crecto"
require "./token"
require "./repository"
require "../utils/command_runner"

class User < Crecto::Model
   schema "users" do
      field :name, String
      field :password, String
      has_many :tokens, Token, dependent: :destroy
      has_many :repositories, Repository, dependent: :destroy
   end

   def create_token
      token = Token.new
      token.uuid = UUID.random.to_s
      token.user = self
      token = Repo.insert(token).instance
      return token
   end

   def create_ssh_key(path)
      command_runner = CommandRunner.new()
      key_file = "#{path}/#{self.id}"
      File.delete(key_file) if File.exists?(key_file)
      File.delete("#{key_file}.pub") if File.exists?("#{key_file}.pub")
      command_runner.run_command("ssh-keygen -f #{self.id} -P \"\"", "#{path}")
   end

   JSON.mapping(id: Int32 | Int64 | Nil, name: String?)

   validate_required [:name, :password]
   unique_constraint :name
end
