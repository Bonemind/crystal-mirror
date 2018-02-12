macro not_found(env)
   next halt env, status_code: 404, response: ({ message: "Not found" }).to_json
end

