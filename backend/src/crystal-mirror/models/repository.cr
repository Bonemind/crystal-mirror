require "crecto"
require "./user"
require "./commandresult"

class Repository < Crecto::Model
   schema "repositories" do
      field :from_url, String
      field :to_url, String
      field :last_polled, Time
      field :poll_interval, Int32, default: 60
      belongs_to :user, User
      has_many :commandresults, Commandresult, dependent: :destroy

   end

   validate_required [:from_url, :to_url]
end
