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
    //run doThis
    doThis(data);
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
function userInquire(userObject, command, dataHolder){
  inquirer.prompt([
    userObject
  ]).then(function(handle){
    if (command === "my-tweets"){
    //ask user what their Twitter handle is
      tweeter(handle.name);
    } else if (command === "spotify-this-song"){
      //ask user what is the name  artist
      spotifyArtist(handle.name,dataHolder);
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
function spotifyThis(songName){
  spotify.search({ type: 'track', query: songName }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      // switch(a){
      //   case "test":
      //   console.log("There are multiple tracks with this name. Help me narrow your search.");
      //   userInquire(spotifyInput, liriCommand, data);
      //   break;
      //
      //   case "err":
      //   console.log(crap);
      //   break;
      //
      //   default:
      //
      // }
      console.log("There are multiple tracks with this name. Help me narrow your search.");
      userInquire(spotifyInput, liriCommand, data);
      //console.log(data);
      // if(true){
      //   if (command === "The Sign"){
      //       console.log("Track: " + data.tracks.items[14].name);
      //       console.log("Artist: " + data.tracks.items[14].artists[0].name);
      //       console.log("Album: " + data.tracks.items[14].album.name);
      //       console.log("Song Preview: " + data.tracks.items[14].preview_url);
      //     } else if (true){
      //       console.log("Track: " + data.tracks.items[0].name);
      //       console.log("Artist: " + data.tracks.items[0].artists[0].name);
      //       console.log("Album: " + data.tracks.items[0].album.name);
      //       console.log("Song Preview: " + data.tracks.items[0].preview_url);
      //     }
      // } else {
      //   if (data.error.status ===  400){
      //     spotifyThis("The Sign",true);
      //   }
      // }
  });
}
//
// var spotifyData = data;
// var numTracks = data.tracks.items.length;
// //if data.tracks.items.length >1
// if (numTracks > 1){
//   userInquire(spotifyInput);
//   return spotifyData;
// } else {
//   console.log("Album: " + data.tracks.items[0].album.name);
//   console.log("Track: " + data.tracks.items[0].name);
//   console.log("Artist: " + data.tracks.items[0].artists[0].name);
//   console.log("Song Preview: " + data.tracks.items[0].preview_url);
// }
//   //user input find artist name
//   //data.tracks.items[i].artists[i].length
//     //data.tracks.items.album.name
//     //data.tranks.items.artists.name

function spotifyArtist(handle, spotifyData){
  var artistArr = [];
  var numArtists = spotifyData.tracks.items;
  for (var i = 0; i < numArtists.length; i++) {
    for (var j = 0; j < numArtists[i].artists.length; j++) {
      if(numArtists[i].artists[j].name == handle){
        console.log("handle: "+handle);
        console.log("Album: " + numArtists[i].album.name);
        console.log("Track: " + numArtists[i].name);
        console.log("Artist: " + numArtists[i].artists[j].name);
        console.log("Song Preview: " + numArtists[i].preview_url);
        break;
      }
    }
  }
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
function doThis(data){
  //split the command and the task information
  var splitData = data.split(",");
  //removing extra "" and /n
  var splitAgain = splitData[1].split('"');
  //grabbing just the task and command
  var newCommand = splitData[0];
  var whatToDo = splitAgain[1];
  console.log(newCommand);

  switch(newCommand){
    case "spotify-this-song":
    spotifyThis(whatToDo);
    break;

    case "my-tweets":
    userInquire(twitterInput, newCommand);
    break;

    case "movie-this":
    whatMovie(whatToDo);
    break;
  }
}

//LIRI inital commands
switch (liriCommand){
  case "my-tweets":
  userInquire(twitterInput, liriCommand);
  break;

  case "spotify-this-song":
  spotifyThis(liriName);
  break;

  case "movie-this":
  whatMovie(liriName);
  break;

  case "do-what-it-says":
  read();
  break;
}
