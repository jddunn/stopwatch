
//  Must run a HTTP server and run the web app from local or web server because of Google / YouTube's API
//  Some original code and comments retained below from FriesFlorian's viralvideos repo: https://github.com/FriesFlorian/ViralVideos

var API_KEY = "";     // INSERT CLIENT API KEY HERE. GET IT FROM GOOGLE DEVELOPER'S CONSOLE, MAKE SURE YOUTUBE DATA API IS ENABLED.
var videoResultsObj = {}
var videoResultsList = []

// Code and comments below from Youtube defaults
// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;       // Youtube player object
//
var vidTagID = ""   // ID of the current video being played


function onYouTubePlayerAPIReady() {
  console.log("playing again.")
  player = new YT.Player('ytplayer', {
  height: '1080',
  width: '1920',
  // suggestedQuality: 'large',
  // Just some random video id for now as a placeholder.. lol
  videoId: 'C-o8pTi6vd8',
  events: {'onStateChange': onPlayerStateChange
  }
});
}


// autoplay video
function onPlayerReady(event) {
    console.log("READY");
    event.target.playVideo();
}


// As long as the user is detected to feel positive overall about the video being played, it'll finish till the end. When the end is reached, play a similar
// video to the one that the user just saw. 
function onPlayerStateChange(event) {        
    if(event.data === 0) {          
        console.log('done');
        findSimilarVideo();
        // skipVideo();
    }
}


$(function() {
    $("form").on("submit", function(e) {
       e.preventDefault();
       // prepare the request
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            // Let's do 50.. it's the max amount the API can return., Pick the most popular 50 videos to be played. These results are dynamic and will change
            // over time as well, so 50 should be a good number to ensure a wide variety of high-quality content. 
            maxResults: '50'
            // order: "viewCount",
            // publishedAfter: "2015-01-01T00:00:00Z"
       }); 
       // execute the request
       request.execute(function(response) {
          var results = response.result;
          console.log(results)
          // $("#results").html("");
          item = results;
          videoResultsObj = results;
          for (var i = 0; i < videoResultsObj.items.length; i++) { 
            tempVidId = videoResultsObj.items[i].id.videoId;
            // console.log(tempVidId)
            videoResultsList.push(tempVidId);
            // console.log(videoResultsList)
          }         
          console.log(videoResultsList);
          shuffleArray(videoResultsList);
          console.log(videoResultsList);
          vidTagID = videoResultsList[0];
          player.loadVideoById(vidTagID);
          resetVideoHeight();
       });
    });
    $(window).on("resize", resetVideoHeight);
});


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}


function init() {
    gapi.client.setApiKey(API_KEY); // Need to set own client ID here from Google Web Console, for this to work
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}


// function getValue(key, videoResults) {
//      for (var el in array) {
//          if (array[el].hasOwnProperty(key)) {   
//              return array[el][key];
//              }
//          }
//     }
