
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
