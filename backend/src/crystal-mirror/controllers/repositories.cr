require "kemal"
require "../models/repo"
require "../models/repository"
require "../utils/validator"
require "../utils/response_macros"
require "../tasks/sync"

WRITABLE_FIELDS = ["from_url", "to_url", "poll_interval"]

# Get the specified repository, throws if the current user
# can't access it
macro get_user_repo
   repository = Repo.get(Repository, env.params.url["id"].to_i)
   not_found(env) if repository.nil?
   forbidden(env) unless env.current_user.not_nil!.id == repository.user_id
   repository = repository.as(Repository)
end

# List this user's repos
get "/repositories" do |env|
   env.response.content_type = "application/json"
   repositories = Repo.get_association(env.current_user.not_nil!, :repositories)
   repositories.as(Array).to_json
end

# Get the results of repository syncs, due to the potential
# size this is paginated
get "/repositories/:id/results/:page" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   get_user_repo
   commandresults = repository.get_results(env.params.url["page"].to_i)
   next commandresults.to_json
end

# Get a repo
get "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   get_user_repo
   next repository.to_json
end

# Force a repo sync, this is asynchronous and just queues
# the repo to be synced
post "/repositories/:id/sync" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   get_user_repo
   SyncRepoTask.dispatch(
      repository,
      Kemal.config.env_config["ssh"]["keys_dir"],
      Kemal.config.env_config["git"]["repo_dir"]
   )

   next { message: "Task queued" }.to_json
end


# Create a new repo
post "/repositories" do |env|
   env.response.content_type = "application/json"
   repository = Repository.new
   cleaned = filter_hash(env.params.json, WRITABLE_FIELDS)
   repository.update_from_hash(cleaned)
   repository.user = env.current_user.not_nil!
   repository_cs = Repo.insert(repository)
   validate_changeset(repository_cs)
   next repository_cs.instance.to_json
end

# Update a repo
put "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   cleaned = filter_hash(env.params.json, WRITABLE_FIELDS)
   get_user_repo
   repository.update_from_hash(cleaned)

   repository_cs = Repo.update(repository)
   validate_changeset(repository_cs)
   next repository_cs.instance.to_json
end

# Delete a repo
delete "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   get_user_repo
   Repo.delete(repository)
   env.response.status_code = 204
end
