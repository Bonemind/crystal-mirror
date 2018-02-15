require "kemal"

get "/test" do
	Kemal.config.env
end
