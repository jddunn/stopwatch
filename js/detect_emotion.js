
// Code from the Affectiva SDK code expanded upon below. Most comments and code are from Affectiva library.
  // SDK Needs to create video and canvas nodes in the DOM in order to function

// Here we are adding those nodes a predefined div.

var divRoot = $("#affdex_elements")[0];
var width = 320;
var height = 240;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
var faces = {}	// Faces detected in the camera. For now, we'll just use the first face detected in the frame, so even if there are multiple, whoever's
					// expression is the strongest will override and control the playback. In the future, we can take the average emotion levls of the
					// faces detected, to get a more accurate result for groups of people waching. 
var emotions = {}
var mainEmoji = {}
var emojis = {}
var expressions = {}

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
// detector.detectAllExpressions();
detector.detectAllEmojis();

// This isn't needed for now (Detects age, gender, race), but could be used. Also could be slightly offensive to some people if it's inaccurate.
// detector.detectAllAppearance();	

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function() {
log('#logs', "The detector reports initialized");
//Display canvas instead of video feed because we want to draw the feature points on it
$("#face_video_canvas").css("display", "block");
$("#face_video").css("display", "none");
});


function checkExpressions() {
	// if detector.
}


function log(node_name, msg) {
	$(node_name).append("<span>" + msg + "</span><br />")
}


//function executes when Start button is pushed.
function onStart() {
	if (detector && !detector.isRunning) {
  		$("#logs").html("");
  	detector.start();
	}
	log('#logs', "Clicked the start button");
}


//function executes when the Stop button is pushed.
function onStop() {
	log('#logs', "Clicked the stop button");
	if (detector && detector.isRunning) {
  		detector.removeEventListener();
    	detector.stop();
	}
};


//function executes when the Reset button is pushed.
function onReset() {
	log('#logs', "Clicked the reset button");
	if (detector && detector.isRunning) {
  		detector.reset();
  		$('#results').html("");
  		$('#emojiDraw').html("");
  		runningPositiveCount = 0;
		runningNegativeCount = 0;
		positiveThreshold = 1000;
    	negativeThreshold = positiveThreshold * 2.5;
	}
};


//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", function() {
log('#logs', "Webcam access allowed");
});

//Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", function() {
log('#logs', "webcam denied");
console.log("Webcam access denied");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function() {
log('#logs', "The detector reports stopped");
$("#results").html("");
$('#emojiDraw').html("");
});


//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
$('#results').html("");
$('#emojiDraw').html("");
// console.log(faces[0].expressions)
// var currentTimer = timestamp.toFixed(2);
// log('#results', "<h4>Video Timer: " + currentTimer);
// log('#results', "Number of faces found: " + faces.length);
if (faces.length > 0) {
  // log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
  log('#results', "<br><h4>Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
    return val.toFixed ? Number(val.toFixed(0)) : val;
  }));
  // log('#results', "<br><h4>Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
    // return val.toFixed ? Number(val.toFixed(0)) : val;
  // }));
  log('#emojiDraw', "Emoji: " + faces[0].emojis.dominantEmoji + "</h4>");
  drawFeaturePoints(image, faces[0].featurePoints);
  // console.log(faces[0].emotions)
  emotions = faces[0].emotions
  emojis = faces[0].emojis
  mainEmoji = faces[0].emojis.dominantEmoji
  expressions = faces[0].expressions
  // console.log(emotions)
  detectEmotionsFromCam(emotions, emojis, expressions);
  // console.log(faces[0].emotions)
  // console.log(faces[0].emojis.dominatEmoji)
}
});


//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints) {
	var contxt = $('#face_video_canvas')[0].getContext('2d');
	var hRatio = contxt.canvas.width / img.width;
	var vRatio = contxt.canvas.height / img.height;
	var ratio = Math.min(hRatio, vRatio);
	contxt.strokeStyle = "#FFFFFF";
	for (var id in featurePoints) {
  		contxt.beginPath();
  		contxt.arc(featurePoints[id].x,
    	featurePoints[id].y, 2, 0, 2 * Math.PI);
  		contxt.stroke();
	}
}

