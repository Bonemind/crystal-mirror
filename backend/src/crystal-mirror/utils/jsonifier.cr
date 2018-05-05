# Macro to allow simple jsonification of objects
# based on instance vars and methods
macro jsonifier(exclude_names = [] of String, include_names = [] of String, include_methods = [] of String)
   def to_json
      String.build do |str|
         to_json str
      end
   end


   def to_json(io : IO)
      JSON.build(io) do |json|
         to_json(json)
      end
   end

   def to_json(json : JSON::Builder)
      {% begin %}
         json.object do
            # all instance vars
            to_serialize = \{{ @type.instance_vars.map &.id.stringify }}

            # remove any exclusions
            to_serialize = to_serialize  - {{ exclude_names }}

            # remove anything that isn't explicitly included
            # unless inclusions is blank, then we include all
            include_names = {{ include_names }}
            to_serialize.reject! do |n|
               !include_names.includes?(n)
            end unless include_names.empty?

            # generate a json.field entry for every ivar, but only serialize if included
            # Works this way because we don't have access to both ivars and the macro vars at the same time
            # so we determine serializiation at runtime based on an if
            \{% for ivar in @type.instance_vars %}
                json.field \{{ ivar.id.stringify }}, @\{{ ivar.id }} if to_serialize.includes?(\{{ivar.id.stringify}})
            \{% end %}

            # also add any methods that are included
            {% for klass in @type.methods %}
               {% if include_methods.includes?(klass.name.stringify) %}
                  json.field {{ klass.name.stringify }}, {{ klass.name }}
               {% end %}
            {% end %}
         end
      {% end %}
   end
end
