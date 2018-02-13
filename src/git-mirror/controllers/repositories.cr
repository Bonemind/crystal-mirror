require "kemal"
require "../models/repo"
require "../models/repository"
require "../utils/validator"
require "../utils/response_macros"
require "../tasks/sync"

get "/repositories" do |env|
   env.response.content_type = "application/json"
   repositories = Repo.all(Repository)
   repositories.as(Array).to_json
end

get "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Repo.get(Repository, env.params.url["id"].to_i)
   not_found(env) if repository.nil?
   next repository.to_json
end

post "/repositories/:id/sync" do |env|
   env.response.content_type = "application/json"
   repository = Repo.get(Repository, env.params.url["id"].to_i)
   not_found(env) if repository.nil?
   #SyncRepoTask.dispatch(repository)

   next { message: "Task queued" }.to_json
end


post "/repositories" do |env|
   env.response.content_type = "application/json"
   repository = Repository.new
   repository.from_url = env.params.json["from_url"].as(String)
   repository.to_url = env.params.json["to_url"].as(String)
   repository.user = env.current_user.not_nil!
   repository_cs = Repo.insert(repository)
   validate_changeset(repository_cs)
   next repository_cs.instance.to_json
end

put "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Repo.get(Repository, env.params.url["id"].to_i)
   if repository.nil?
      halt env, status_code: 404, response: {message: "Not found"}.to_json
   end
   if env.params.json["from_url"]?
      repository.from_url = env.params.json["from_url"].as(String)
   end

   if env.params.json["to_url"]?
      repository.to_url = env.params.json["to_url"].as(String)
   end

   repository_cs = Repo.update(repository)
   validate_changeset(repository_cs)
   next repository_cs.instance.to_json
end

delete "/repositories/:id" do |env|
   env.response.content_type = "application/json"
   repository = Repo.get(Repository, env.params.url["id"].to_i)
   not_found(env) if repository.nil?
   Repo.delete(repository)
   env.response.status_code = 204
end
