var fs = require("fs");
var Twitter = require('twitter');
var twitterStuff = require("./keys.js");
var inquirer = require("inquirer");
var spotify = require('spotify');

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
function userInquire(userObject){
  inquirer.prompt([
    userObject
  ]).then(function(handle){
    if (liriCommand === "my-tweets"){
    //ask user what their Twitter handle is
      tweeter(handle.name);
    } else if (liriCommand === "spotify-this-song"){
      //ask user what is the name  artist
      spotifyThis(handle.name);
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
  spotify.search({ type: 'artist OR album OR track', query: command }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      var spotifyData = data;
      //if data.tracks.items.length >1
      if (numTracks > 1){
        userInquire(spotifyInput);
        return spotifyData;
      } else {
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Track: " + data.tracks.items[0].name);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Preview: " + data.tracks.items[0].preview_url);
      }
        //user input find artist name
        //data.tracks.items.artists.length
          //data.tracks.items.album.name
          //data.tranks.items.artists.name
  });
}

function spotifyArtist(spotifyData){

}


//movie-this
function whatMovie(){

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
  whatMovie();
  break;

  case "do-what-it-says":
  doThis();
  break;
}
