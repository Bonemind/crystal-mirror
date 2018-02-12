require "crecto"
require "./user"

class Repository < Crecto::Model
   schema "repositories" do
      field :from_url, String
      field :to_url, String
      belongs_to :user, User
   end

   validate_required [:from_url, :to_url]
end
