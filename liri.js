var fs = require("fs");
var Twitter = require('twitter');
var twitterStuff = require("./keys.js");
var inquirer = require("inquirer");
var spotify = require('spotify');
var request = require("request");


var client = new Twitter({
consumer_key: twitterStuff.twitterKeys.consumer_key,
consumer_secret: twitterStuff.twitterKeys.consumer_secret,
access_token_key: twitterStuff.twitterKeys.access_token_key,
access_token_secret: twitterStuff.twitterKeys.access_token_secret
});

//command for liri from command line
var liriCommand = process.argv[2];
var liriName= process.argv[3];

//fs read file function
function read(){
  fs.readFile("random.txt", "utf8", function(err, data) {
    if(err){ console.log(err); }
  });
}

//fs append to file
function append(){
  fs.appendFile("random.txt", numAmount, function(err) {
    if(err){ console.log(err); }
  });
}
//object constructor for user prompt
function UserPrompt(type, name, message){
  this.type = type;
  this.name = name;
  this.message = message;
}

var twitterInput = new UserPrompt("input", "name", "What is your Twitter handle?");

var spotifyInput = new UserPrompt("input", "name", "What is the name of the Artist?");

var artistsName;
//inquirer function
function userInquire(userObject, spotifyData){
  inquirer.prompt([
    userObject
  ]).then(function(handle){
    if (liriCommand === "my-tweets"){
    //ask user what their Twitter handle is
      tweeter(handle.name);
    } else if (liriCommand === "spotify-this-song"){
      //ask user what is the name  artist
      spotifyArtist(handle.name);
    }
  });
}

//my-tweets
function tweeter(userName){
  //take user input then uses it to gather their tweets
  //also works for other public twitter handles not their own
  var params = {screen_name: userName, count: 20};
  client.get('statuses/user_timeline', params, function(err, tweets) {

    if (err) { console.log(err); }

    for (var i = 0; i < tweets.length; i++) {
      console.log("-----------------------------------------");
      console.log(tweets[i].created_at);
      console.log(tweets[i].text);
      console.log("-----------------------------------------");
    }
  });
}

//spotify-this-song
function spotifyThis(command){
  spotify.search({ type: 'track', query: command }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      console.log(data);
      if(true){
        if (command === "The Sign"){
            console.log("Track: " + data.tracks.items[14].name);
            console.log("Artist: " + data.tracks.items[14].artists[0].name);
            console.log("Album: " + data.tracks.items[14].album.name);
            console.log("Song Preview: " + data.tracks.items[14].preview_url);
          } else if (true){
            console.log("Track: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Song Preview: " + data.tracks.items[0].preview_url);
          }
      } else {
        if (data.error.status ===  400){
          spotifyThis("The Sign",true);
        }
      }
  });
}



//movie-this
function whatMovie(movieName){
  var name;
  if(movieName){
    name = movieName;
  } else {
    name = "mr+nobody";
  }

  var movieUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&r=json";

  request(movieUrl, function(err, response, body){
    var objectString = JSON.parse(body);
    if(err){
      console.log(err);
    } else {
      console.log("Movie Title: " + objectString.Title);
      console.log("Year: " + objectString.Year);
      console.log("Rating: " + objectString.Rated);
      console.log("Country: " + objectString.Country);
      console.log("Language: " + objectString.Language);
      console.log("Plot: " + objectString.Plot);
      console.log("Actors: " + objectString.Actors);
    }

  });

}

//do-what-it-says
function doThis(){

}


switch (liriCommand){
  case "my-tweets":
  userInquire(twitterInput);
  break;

  case "spotify-this-song":
  spotifyThis(liriName);
  break;

  case "movie-this":
  whatMovie(liriName);
  break;

  case "do-what-it-says":
  doThis();
  break;
}
