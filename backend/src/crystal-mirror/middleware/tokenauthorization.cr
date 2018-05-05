require "kemal"
require "http/server"
require "json"
require "../models/repo"
require "../models/token"

class HTTP::Server
  # Add the current user to the context
  class Context
    @current_user : User?

    property :current_user
  end
end


# Requires all non-excluded requests to have a validate token
# in the Authorization header of the form: Bearer <token>
class TokenMiddleware < Kemal::Handler
   HEADER = "Authorization"
   PREFIX = "Bearer"

   exclude ["/auth/login"], "POST"
   exclude ["/*"], "OPTIONS"

   def call(context)
      return call_next(context) if exclude_match?(context)
      if context.request.headers[HEADER]?
         if value = context.request.headers[HEADER]
            if value.size > 0 && value.starts_with?(PREFIX)
               token_string = value.lchop(PREFIX).lstrip
               token = Repo.get_by(Token, uuid: token_string)
               token = token.as(Token) unless token.nil?
               user = Repo.get_association(token, :user).as(User) unless token.nil?
               context.current_user = user
            end
         end
      end

      unless context.current_user.nil?
         return call_next context
      end
      headers = HTTP::Headers.new
      context.response.status_code = 401
      context.response.print "401, Unauthorized"
   end
end

def token_auth
   add_handler TokenMiddleware.new
end
