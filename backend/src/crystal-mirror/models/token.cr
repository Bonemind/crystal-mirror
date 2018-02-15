require "crecto"
require "./user"

class Token < Crecto::Model

   schema "tokens" do
      field :uuid, String
      belongs_to :user, User
   end

   validate_required [:uuid]
   unique_constraint :uuid
end
