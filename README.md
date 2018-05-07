# Crystal-mirror

Crystal mirror is a system that allows you to mirror the contents of a git
repository to another. Currently, this is done by polling at a certain interval.
Support for hooks and such is yet to come.

## Installation

The easiest way to get started is to run de docker-compose file which will spin
up the back and frontend, as well as a postgres database to store data into.

Alternatively, you could `crystal build sam.cr` and `crystal build /src/crystal-mirror.cr`
for the backend, 
Backend:

   - Install the crystal compiler
   - `shards install`
   - `crystal build sam.cr`
   - `crystal build /src/crystal-mirror.cr`

This will leave you with two executables, `sam.cr` is used for management tasks,
whereas `crystal-mirror` is the actual backend. Both of these expect a `config.yml`
next to them that will be used for database connections and such.

Frontend:
   
   - Install node and yarn
   - `yarn`
   - `yarn build`

This will build a release version of the frontend, which then expects to be able to
communicate with the backend on a `/api` route which is proxied to the backend.

Docker images are available on dockerhub and are built automatically:

[Backend](https://hub.docker.com/r/bonemind/crmirror-backend/)

[Frontend](https://hub.docker.com/r/bonemind/crmirror-frontend/)

The develop tag contains the latest dev branch commit, while latest is the latest release version.
Tagged releases are also available by semver-like tagname.

## Usage

After deployment, a default user will exist whith `admin` as username, and `somepass`
as password. After logging in you'll probably want to change the password by either going
to `Profile` or editing the user from the user overview. After which you'll need to generate
an ssh key by going to profile and clicking the recycle icon. Normally this is generated on
user creation but the initial admin user is special that way.

To actually start mirroring repositories you go to the `Repositories` option and click the plus
icon to add a new one, where from is the source repository, and to is the target. Fill in the ssh
urls for the repositories, and set a poll interval in minutes (Where 0 implies no polling). Also
make sure the hosts of the repositories (e.g. Github) know your ssh key. To force a sync you can click
the refresh icon, and to view the results you can click the thumbs up/down icon.

Note: Repository syncing is not immediate but asynchronous, and as such may take a few minutes
to actually happen.

Warning: Crystal mirror will automatically prune any removed tags and branches on the receiving
end, so this might be potentially dangerous.

## Development

Backend:

Install `crystal`, configure development variables in the `config.yml` file, then start
the backend using `crystal src/crystal-mirror.cr`. To run migrations or some utility methods
you can use `sam.cr`. To see the available commands run `crystal sam.cr -- help`.

The frontend is configured to proxy backend requests from `/api` to `localhost:3200`.

## Contributing

1. Fork it ( https://github.com/Bonemind/crystal-mirror/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [Bonemind](https://github.com/Bonemind) Subhi Dweik - creator, maintainer
