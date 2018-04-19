
macro validate_changeset(changeset)
   unless {{changeset}}.valid?
      halt env, status_code: 400, response: ({
         message: "Validation error",
         errors: {{changeset}}.errors
      }).to_json
   end
end

macro validate_model(model, cls)
   changeset = {{cls}}.changeset({{model}})
   validate_changeset(changeset)
end

def filter_hash(input_hash, keys)
   output_hash = {} of String => String
   keys.each do |k|
      output_hash[k.to_s] = input_hash[k].to_s if input_hash.has_key?(k)
   end
   return output_hash
end

