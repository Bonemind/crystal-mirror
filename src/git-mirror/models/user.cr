require "crecto"
require "./token"

class User < Crecto::Model
   schema "users" do
      field :name, String
      field :password, String
      has_many :tokens, Token, dependent: :destroy
   end

   def create_token
      token = Token.new
      token.uuid = UUID.random.to_s
      token.user = self
      token = Repo.insert(token).instance
      return token
   end

   validate_required [:name, :password]
   unique_constraint :name
end
