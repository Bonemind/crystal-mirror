require "crecto"

class User < Crecto::Model

   schema "users" do
      field :name, String
      field :password, String
   end

   validate_required [:name, :password]
end
