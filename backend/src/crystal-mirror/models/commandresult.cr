require "crecto"
require "./repository"

class Commandresult < Crecto::Model
   schema "commandresults" do
      field :output, String
      field :status, Int32
      belongs_to :repository, Repository
   end

   validate_required [:status]
end
