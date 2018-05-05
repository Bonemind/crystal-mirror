require "crecto"
require "./user"
require "../utils/jsonifier";

# Identifies a user
class Token < Crecto::Model

   schema "tokens" do
      field :uuid, String
      belongs_to :user, User
   end

   jsonifier

   validate_required [:uuid]
   unique_constraint :uuid
end
