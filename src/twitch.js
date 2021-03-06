const request = require('./bin/request.js');
const url = require('url');
const Promise = require('bluebird');

/**
* @description : Creates our twitch class
* @param {Object<id, secret>} options : pases our client id and secret to the constructor
*/
function TwitchCtrl(options) {
    this.id = options.id;
    this.secret = options.secret;
}

/**
* @description : makes a request to protocol http or https server with correct API headers
* @param {String} http : passes an string to our request
* @returns {Promise.<string, Error>} returns data from an http request;
*/
TwitchCtrl.prototype.makeRequest = function(http) {
    return new Promise((resolve, reject) => {
        // set the headers in our request
            let headers = {
              "Client-ID" : this.id,
              "Accept": "application/vnd.twitchtv.v5+json"
            };
            // use our request module to make a http request
            request.get(http, headers)
                .then(resolve)
                .catch(reject);
    });
}

/**
* @description : gets user data from the api
* @param {String} username : the username we want information from
* @returns {Promise.<string, Error>} : resolves JSON data or rejects an error
*/
TwitchCtrl.prototype.getUser = function(username) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        let url = `https://api.twitch.tv/kraken/streams/${username}`;
        // make our request
        this.makeRequest(url)
            .then(data => {
                // resolve our data and parse as a JSON
                resolve(JSON.parse(data));
            })
            .catch(reject);
    });
}

/**
* @description : Gets featured streams
* @param {Hash} options : optional query params
* @param {Integer} options.limit : maximum number of objects in array {Default: 25} {Maximum: 100}
* @param {Integer} options.offset : object offset for pagination {Default: 0}
* @returns {Promise.<string, Error>} : resolve JSON data or rejects an error
*/
TwitchCtrl.prototype.getFeaturedStreams = function(options) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        let url = "https://api.twitch.tv/kraken/streams/featured"
        if(options) {
            _buildOptions(options, data => {
                url += data;
            })
        }
        // make our request
        this.makeRequest(url)
            .then(data => {
                resolve(JSON.parse(data));
            })
            .catch(reject);
    });
}

/**
* @description : Makes an api call to retrieve all top streams on twitch
* @param {Hash} options : optional query params
* @param {String} options.channel : streams from a comma separated list of channels
* @param {String} options.game : streams categorized under {game}
* @param {String} options.language : only shows streams of a certain language. Permitted values are locale ID strings, e.g. {en}, {fi}, {es-mx}
* @param {String} options.stream_type : only shows streams from a certain type. Permitted values: {all}, {playlist}, {live}
* @param {Integer} options.limit : maximum number of objects in array {Default: 25} {Maximum: 100}
* @param {Integer} options.offset : object offset for pagination {Default: 0}
* @returns {Promise.<string, Error>} : resolves JSON data or rejects an error
*/
TwitchCtrl.prototype.getTopStreams = function(options) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        let url = "https://api.twitch.tv/kraken/streams";

        if(options) {
            _buildOptions(options, data => {
                url += data;
            })
        }
            // make our request
            this.makeRequest(url)
                .then(data => {
                    // resolve our data and parse as a JSON
                    resolve(JSON.parse(data));
                })
                .catch(reject);
        });
}

/**
* @description : Makes an API call to top games on twitch
* @param {Hash} options : optional query params
* @param {Integer} options.limit : maximum number of objects in array {Default: 25} {Maximum: 100}
* @param {Integer} options.offset : object offset for pagination {Default: 0}
* @returns {Promise.<string, Error>} : resolves JSON data or rejects an error
*/
TwitchCtrl.prototype.getTopGames = function(options) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        let url = "https://api.twitch.tv/kraken/games/top";

        if(options) {
            _buildOptions(options, data => {
                url += data;
            })
        }

        // make our request
        this.makeRequest(url)
            .then(data => {
                // resolve our data and parse as a JSON
                resolve(JSON.parse(data));
            })
            .catch(reject);
    });
}

/**
* @description : searches users by game
* @param {String} game : the game we want to search
* @returns {Promise.<string, Error>} : resolves JSON data or rejects an error
*/
TwitchCtrl.prototype.getUsersByGame = function(game) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        let url = `https://api.twitch.tv/kraken/streams/?game=${game}`;
        // make our request
        this.makeRequest(url)
            .then(data => {
                // resolve our data and parse as a JSON
                resolve(JSON.parse(data));
            })
            .catch(reject);
    });
}

/**
* @description : finds rtmp streams
* @param {String} user : the user we want to search
* @returns {Promise.<string, Error>} : resolves link
*/
TwitchCtrl.prototype.getStreamUrl = function(user) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        user = user.toLowerCase();
        let url = `http://api.twitch.tv/api/channels/${user}/access_token`;
        // make our request
        this.makeRequest(url)
            .then(data => {
                data = JSON.parse(data);
                let streamUrl = `http://usher.twitch.tv/api/channel/hls/${user}.m3u8?player=twitchweb&&token=${data.token}&sig=${data.sig}&allow_audio_only=true&allow_source=true&type=any&p={random}`

                if(data.error === "Not Found") {
                    return reject(data.error);
                } else {
                    return resolve(streamUrl);
                }
            })
            .catch(console.error)
    });
}

/**
* @description : search for channels based on specified query parameter
* @param {String} query : a channel is returned if the query parameter is matched entirely or partially, in the channel description or game name
* @param {Integer} limit : maximum number of objects to return, sorted by number of followers {Default: 25} {Maximum: 100}
* @param {Integer} offset : object offset for pagination of results {Default: 0}
* @returns {Promise.<string, Error>} : resolves JSON data or rejects an error
*/
TwitchCtrl.prototype.searchChannels = function(query, limit = 25, offset = 0) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        query = encodeURIComponent(query);
        let url = `https://api.twitch.tv/kraken/search/channels?query=${query}&limit=${limit}&offset=${offset}`;
        // make our request
        this.makeRequest(url)
            .then(data => {
                // resolve our data and parse as a JSON
                resolve(JSON.parse(data));
            })
            .catch(reject);
    });
}

/**
* @description : search for streams based on specified query parameter
* @param {String} query : a stream is returned if the query parameter is matched entirely or partially, in the channel description or game name
* @param {Integer} limit : maximum number of objects to return, sorted by number of followers {Default: 25} {Maximum: 100}
* @param {Integer} offset : object offset for pagination of results {Default: 0}
* @returns {Promise.<string, Error>} : resolves JSON data or rejects an error
*/
TwitchCtrl.prototype.searchStreams = function(query, limit = 25, offset = 0) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        query = encodeURIComponent(query);
        let url = `https://api.twitch.tv/kraken/search/streams?query=${query}&limit=${limit}&offset=${offset}`;
        // make our request
        this.makeRequest(url)
            .then(data => {
                // resolve our data and parse as a JSON
                resolve(JSON.parse(data));
            })
            .catch(reject);
    });
}

/**
* @description : search for games based on specified query parameter
* @param {String} query : a url-encoded search query
* @param {Boolean} live : if true, only returns games that are live on at least one channel  {Default: false}
* @returns {Promise.<string, Error>} : resolves JSON data or rejects an error
*/
TwitchCtrl.prototype.searchGames = function(query, live = false) {
    return new Promise((resolve, reject) => {
        // set our URL for working with the api
        query = encodeURIComponent(query);
        let url = `https://api.twitch.tv/kraken/search/games?query=${query}&type=${type}&live=${live}`;
        // make our request
        this.makeRequest(url)
            .then(data => {
                // resolve our data and parse as a JSON
                resolve(JSON.parse(data));
            })
            .catch(reject);
    });
}

function _buildOptions(options, callback) {
    callback(Object.keys(options).reduce((params, option, index) => {
        const encodedParam = `${encodeURIComponent(option)}=${encodeURIComponent(options[option])}`;
        if(index === 0) {
            return `?${encodedParam}`;
        }
        return `${params}&${encodedParam}`;
    }, ''));
}

module.exports = TwitchCtrl;
