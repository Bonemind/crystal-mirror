require "kemal"
require "../models/repo"
require "../models/repository"
require "../utils/validator"
require "../utils/response_macros"
require "../tasks/sync"

macro get_user_repo
   repository = Repo.get(Repository, env.params.url["id"].to_i)
   not_found(env) if repository.nil?
   forbidden(env) unless env.current_user.not_nil!.id == repository.user_id
   repository = repository.as(Repository)
end

get "/repositories" do |env|
   env.response.content_type = "application/json"
   repositories = Repo.get_association(env.current_user.not_nil!, :repositories)
   repositories.as(Array).to_json
end

get "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   get_user_repo
   next repository.to_json
end

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


post "/repositories" do |env|
   env.response.content_type = "application/json"
   repository = Repository.new
   repository.from_url = env.params.json["from_url"].as(String)
   repository.to_url = env.params.json["to_url"].as(String)
   repository.poll_interval = env.params.json["poll_interval"].as(String).to_i
   repository.user = env.current_user.not_nil!
   repository_cs = Repo.insert(repository)
   validate_changeset(repository_cs)
   next repository_cs.instance.to_json
end

put "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   get_user_repo
   if env.params.json["from_url"]?
      repository.from_url = env.params.json["from_url"].as(String)
   end

   if env.params.json["to_url"]?
      repository.to_url = env.params.json["to_url"].as(String)
   end

   if env.params.json["poll_interval"]?
      repository.poll_interval = env.params.json["poll_interval"].as(String).to_i
   end

   repository_cs = Repo.update(repository)
   validate_changeset(repository_cs)
   next repository_cs.instance.to_json
end

delete "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Nil
   get_user_repo
   Repo.delete(repository)
   env.response.status_code = 204
end
