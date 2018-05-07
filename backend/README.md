# Crystal mirror backend

The backend for crystal mirror. Built on Kemal.

### Folders

 - `migrations/` - Micrate formatted migrations
 - `src/crystal-mirror` - The main application source folder
   - `controllers/` - Endpoints of the api
   - `middleware/` - Request middleware, currently auth and cors
   - `models/` - Crecto model definitions for every db table
   - `tasks/` - Dispatch tasks, async tasks for the syncing of repositories
   - `utils/` - Assorted functions that don't really go anywhere else

### Dev setup

Clone the repo.

 - `shards install`
 - Set up postgresql somewhere
 - Copy and configure `config.yml` from config.example.yml
 - `crystal sam.cr -- db.migrate`
 - `crystal src/crystal-mirror.cr`

Use `bin/ameba` for style linting.




