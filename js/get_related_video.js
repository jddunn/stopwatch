// Functions to find the related video of the video being played, if it plays all the way through successfully without skipping.
// Written based off hitautodestruct's code here; https://github.com/hitautodestruct/related-video

var d = {};

// The similar videos are being put into a list, for possible future expansion. For now, we just want remember and play the most similar video to the current.

jQuery(function($){
      d = {
        part:'snippet',
        type:'video',
        relatedToVideoId: vidTagID,
        key: API_KEY,
        maxResults: 1
      }
        // $relatedId = vidTagID;
  });

  function getRelated () {
    d.relatedToVideoId = vidTagID || $relatedId.val() || d.relatedToVideoId;
    $.getJSON('https://www.googleapis.com/youtube/v3/search', d, function(data){
      similarVideos = [];
      data.items.forEach(function(item){
      similarVideos.push(item.id.videoId);
      });
      console.log("Playing a video similar to the last..");
      player.loadVideoById(similarVideos[0]);
      resetVideoHeight();
    });
  };
  