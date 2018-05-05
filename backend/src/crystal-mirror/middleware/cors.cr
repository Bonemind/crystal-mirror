require "kemal"
require "http/server"


def cors_middleware
   # Adds cors headers to all routes
   before_all do |env|
      env.response.headers["Access-Control-Allow-Origin"] = "*"
      env.response.headers["Access-Control-Allow-Methods"] = "GET, HEAD, POST, PUT, DELETE, OPTIONS"
      env.response.headers["Access-Control-Allow-Headers"] = "Content-Type, Accept, Origin, Authorization"
      env.response.headers["Access-Control-Max-Age"] = "86400"
   end

   # Registers all routes to have an OPTIONS route
   # useful for preflight checks
   options "/*" do |env|
      env.response.headers["Content-Length"] = "0"
      halt env, status_code: 200, response: ""
   end
end
