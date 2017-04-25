# spa-co-auth-demo

This is a demo JQuery app to show the use of the new cross-origin authentication endpoint.

## Setup

Rename `auth0-variables.js.example` to `auth0-variables.js` and make sure that you have AUTH0_CLIENT_ID, AUTH0_DOMAIN, and AUTH0_CALLBACK_URL defined. Also, make sure to add the callback URL (for example `http://localhost:8080/`) in the **Allowed Callback URLs** section.

You must also set your client to support cross-origin authentication by setting `client.crossorigin: true`

## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g http-server`
3. run `http-server` in the directory of the project.

Go to `http://localhost:8080` and you'll see the app running :).

