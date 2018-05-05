require "crecto"
require "./user"
require "./commandresult"
require "../utils/jsonifier"

RESULT_PAGE_COUNT = 20

# Represents git repositories
# Currently simple from/to urls
# TODO: Make bidirectional
# TODO: Allow --force
class Repository < Crecto::Model
   schema "repositories" do
      field :from_url, String
      field :to_url, String
      field :poll_interval, Int32, default: 60
      belongs_to :user, User
      has_many :commandresults, Commandresult, dependent: :destroy
   end

   # Fetch the latest sync result
   def last_result
      query = Crecto::Repo::Query.where(repository_id: self.id).order_by("created_at DESC").limit(1)
      results = Repo.all(Commandresult, query)
      return results.first?
   end

   # Fetch the sync results, paginated due to potential size
   def get_results(page : Int32)
      query = Crecto::Repo::Query
         .where(repository_id: self.id)
         .order_by("created_at DESC")
         .limit(RESULT_PAGE_COUNT)
         .offset(RESULT_PAGE_COUNT * (page - 1))
      results = Repo.all(Commandresult, query)
      total = Repo.aggregate(Commandresult, :count, :id,
                             Crecto::Repo::Query.where(repository_id: self.id)).as(Int64)
      return {
         "page" => page,
         "page_results" => RESULT_PAGE_COUNT,
         "total" => total,
         "results" => results.as(Array)
      }
   end

   jsonifier(exclude_names: ["commandresults", "initial_values", "user"], include_methods: ["last_result"])

   validate_required [:from_url, :to_url]
end
