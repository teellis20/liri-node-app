require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);


var divider = "***************"
var command = process.argv[2];
var criteria = process.argv.slice(3).join(" ");
var bandURL = "https://rest.bandsintown.com/artists/" + criteria + "/events?app_id=codingbootcamp";
// var movieURL = "http://www.omdbapi.com/?t=" + criteria + "&y=&plot=short&apikey=trilogy";


function findBand() {
    axios.get(bandURL).then(function(response) {
        var band = response.data;
        var bandData = [
            "Venue: " + band[0].venue.name,
            "Venue Location:" + band[0].venue.city + ", " + band[0].venue.country,
            "Date: " + band[0].datetime
        ].join("\n\n");

        fs.appendFile("log.txt", bandData + divider, function(err) {
            if (err) throw err;
            console.log(bandData);
        })
    })
};

function findSong() {
    spotify.search({ type: "track", query: criteria}, function(err, data) {
    if (err) {
        return console.log("Error occurred: " + err);
    }
        
        var songData = [ 
            "Artist(s): " + data.tracks.items[0].artists[0].name,
            "Song Title: " + data.tracks.items[0].name,
            "Preview Link: " + data.tracks.items[0].preview_url,
            "Album: " +  data.tracks.items[0].album.name,
        ].join("\n\n");

        // console.log(songData);
        fs.appendFile("log.txt", songData + divider, function(err) {
            if (err) throw err;
            console.log(songData);
    });
});

};

function findMovie() {
    var movieURL = "http://www.omdbapi.com/?t=" + criteria + "&y=&plot=short&apikey=trilogy";

    if (!criteria) {
        criteria = "bohemian rhapsody";
        findMovie();
    } else {
    axios.get(movieURL).then(function(response) {
    var movie = response.data;
    var movieData = [
        "Title: " + movie.Title,
        "Year: " + movie.Year,
        "IMDB Rating: " + movie.imdbRating,
        "Country: " + movie.Country,
        "Language: " + movie.Language,
        "Plot: " + movie.Plot,
        "Actors: " + movie.Actors
    ].join("\n\n");

    fs.appendFile("log.txt", movieData + divider, function(err) {
        if (err) throw err;
        console.log(movieData);
    })

    });
    }
};

function doIt() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        dataArr = data.split(",");
            command = dataArr[0] 
            criteria = dataArr[1];
        
            if (command === "concert-this") {
                findBand();
            } 
            else if (command === "spotify-this-song") {
                if (!criteria) {
                    criteria = "Crazy";
                    findSong();
                } else {
                findSong();
                }
            }
             else if (command === "movie-this") {
                findMovie();
            } 
        
    });
};


if (command === "concert-this") {
    findBand();
} 
else if (command === "spotify-this-song") {
    if (!criteria) {
        criteria = "Crazy";
        findSong();
    } else {
    findSong();
    }
}
 else if (command === "movie-this") {
    findMovie();
} 
else if (command === "do-what-it-says") {
    doIt();
}