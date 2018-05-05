require "crecto"
require "./repository"

# Stores the result of a git repo synce
class Commandresult < Crecto::Model
   schema "commandresults" do
      field :output, String
      field :status, Int32
      belongs_to :repository, Repository
   end

   validate_required [:status]
end
