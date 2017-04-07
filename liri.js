var fs = require("fs");
var Twitter = require('twitter');
var twitterStuff = require("./keys.js");

var client = new Twitter({
consumer_key: twitterStuff.consumer_key,
consumer_secret: twitterStuff.consumerSecret,
access_token_key: twitterStuff.access_token_key,
access_token_secret: twitterStuff.access_token_secret
});

//command for liri from command line
var liriCommand = process.argv[2];

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

//my-tweets
function tweeter(){
  //queryUrl
  var params = {screen_name: 'rrodwell85', count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      console.log(tweets);
    }
  });
}




//spotify-this-song
function spotifyThis(){

}

// movie-this
function whatMovie(){

}

//do-what-it-says
function doThis(){

}


switch (liriCommand){
  case "my-tweets":
  tweeter();
  console.log("run tweeter");
  break;

  case "spotify-this-song":
  spotifyThis();
  break;

  case "movie-this":
  whatMovie();
  break;

  case "do-what-it-says":
  doThis();
  break;
}
