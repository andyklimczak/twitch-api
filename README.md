# TWITCH-API
### The twitch API v5 made easy

## Twitch Class

### Starting
The class object takes two parameters in the object, the client ID and the client secret.
Create the a new object with the correct parameters to use the class.

The package [dotenv](https://github.com/motdotla/dotenv) is recommended for keeping your client information secret.
```js
const Twitch = require("twitch.tv-api");
const twitch = new Twitch({
    id: "YOUR ID HERE"
    secret: "YOUR SECRET HERE"
});
```

### Methods

| METHOD  | DESCRIPTION |
|:--------:|:-----------:|
| `.getUser(user)` | Returns information about a user |
| `.getFeaturedStreams(options*)` | Returns twitch's featured streams |
| `.getTopStreams(options*)`      | Returns the current top streams |
| `.getTopGames(options*)`        | Returns the top games |
| `.getUsersByGame(game)`  |  Returns users by game |
| `.getStreamUrl(user)`    | Returns the RTMP stream URL |
| `.searchChannels(query, limit*, offset*)` | Returns a list of channels |
| `.searchStreams(query, limit*, offset*)` | Returns a list of streams |
| `.searchGames(query, live*)` | Returns a list of games |
*Parameter is optional or has default values.

### Using

The twitch api module uses promises to resolve/reject data.

```js
const Twitch = require("twitch.tv-api");
const twitch = new Twitch({
    id: "YOUR ID HERE"
    secret: "YOUR SECRET HERE"
});

twitch.getUser("idietmoran")
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

// making requests with optional parameters
const optionalParams = {game: 'StarCraft: Brood War', language: 'es'};
twitch.getTopStreams(optionalParams)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

twitch.getFeaturedStreams({limit: 5})
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

// non es6
twitch.getTopStreams()
    .then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.error(error);
    });
```

### Example

Here is an example of routing the requests through a [Hapi](https://github.com/hapijs/hapi) server.

```js
require("dotenv").config();
const Hapi = require('hapi');
const Twitch = require("twitch.tv-api");


const server = new Hapi.Server({})

const twitch = new Twitch({
    id: process.env.TWITCH_ID,
    secret: process.env.TWITCH_SECRET
});

server.connection({
    port: process.env.PORT,
    host: process.env.HOST,
});

server.route({
    method: 'GET',
    path: '/twitch/api/game/{game}',
    handler: (request, reply) => {
        twitch.getUsersByGame(request.params.game)
            .then(reply)
            .catch(reply);
    }
});

server.start(err => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
```
