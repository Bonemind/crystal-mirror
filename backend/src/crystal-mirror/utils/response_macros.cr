macro not_found(env)
   next halt env, status_code: 404, response: ({ message: "Not found" }).to_json
end

macro forbidden(env)
   next halt env, status_code: 403, response: ({ message: "Forbidden" }).to_json
end

macro check_is_user_resource(env, id)
   if env.current_user.nil? || {{id}} != env.current_user.not_nil!.id
      forbidden(env)
   end
end
