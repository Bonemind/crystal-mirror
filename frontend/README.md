# Crystal-mirror front end

This is the front end for the crystal mirror application.

It is built on hyperapp, and bootstrap as a ui library.

### Folders

 - `src/state` - Contains the initial state for every state scope
 - `src/actions` - Contains any scope actions
 - `src/components` - Views and components to actually render the ui
 - `client.js` - Apiclient that handles authed and unauthed communication

Eslint is configured for codestyle. Webpack is configured with a webpack-bundle-analyzer
on port 8888, and it proxies requests to `/api` to `localhost:3200`.
