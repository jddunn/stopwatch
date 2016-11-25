
// When enough positive reactons are elicited, a similar video to the current video will play. As long as the user doesn't start showing negative emotions,
//  the current video will keep playing.

// If the user is detected to continue enjoying the similar video found (and thus the video plays through till the end), another video similar 
//  to the finished video will be played, and so on, and so on, until the negative threshold is reached. If there is enough negativity
//  detected, the code will pick from the next item in the original playlist specified by the user.

// As more positive emotions are detected, the negative count is lowered, and goes down even into the negatives (There's timer that resets everything every
//  5 second timer to reset threshold to weed out false positives in emotion recognition


var runningPositiveCount = 0;
var runningNegativeCount = 0;

// The absolute value between positive and negative count. This must be higher than a certain amount in order for the positive / negative interactions to 
//	activate. If both pos and neg emotions are at similar ranges (absolute value is low), then the program should remain neutral. 
var posNegCountDifference = 0; 

//	Thresholds to change or play similar videos. Will be running toals and reset on timers
var positiveThreshold = 100;
//	Let's make negative a higher threshold to start out with, since Affectiva's SDK consistently picks up some neutral expressions as negative. 
//	There is one more emotion classified as negative too, so this will be set off more likely. Let's make it at least 1.5 times as high as positive threshold.
var negativeThreshold = positiveThreshold / 1.5;
var posThresholdMet = false;
var negThresholdMet = false;

var timerToSet = 3500;

// Start at 1, because the first video will have already been played.
var vidCount = 1; 

// Similar video to be played next if enough positive reactions are seen
var similarVideos = ""; 


function detectEmotionsFromCam() {
	// console.log(emotions); console.log(emojis); console.log(expressions);
	//		POSITIVE EMOTIONS
	// console.log(emotions.joy); console.log(emotions.surprise); // In the case of watching digital, viral content, being surprised is definitely positive!
	// 		How about fear? Let's say yes. We're talking about being entertained here.
	// console.log(emotions.fear);
	// 		NEGATIVE EMOTIONS
	// console.log(emotions.anger); 
	// console.log(emotions.contempt); console.log(emotions.disgust); console.log(emotions.fear); console.log(emotions.sadness);
	runningPositiveCount = (parseFloat(runningPositiveCount) + (parseFloat(emotions.joy) * 3.5) + (parseFloat(emotions.surprise) * 3.5) + (parseFloat(emotions.engagement) * 2.5)
	+ (parseFloat(emotions.valence) * 2.5));
	runningNegativeCount = ((parseFloat(runningNegativeCount) + (parseFloat(emotions.anger) * 2.5) + (parseFloat(emotions.contempt) * 1.5) + 
	                       (parseFloat(emotions.disgust) * 2.5) + (parseFloat(emotions.sadness) * 2.5) + parseFloat(emotions.fear) + parseFloat(emotions.valence) / 1.5)) - (runningPositiveCount * 1.5);
	// console.log("POSITIVE: " + runningPositiveCount); console.log("NEGATIVE: " + runningNegativeCount);
	metThreshold();
}


setInterval(function(){
    resetTimersAndValues()}, timerToSet)
function resetTimersAndValues () {
	console.log("RESET");
	runningPositiveCount = 0;
	runningNegativeCount = 0;
	positiveThreshold = 100;
    negativeThreshold = positiveThreshold / 1.5;
}


function metThreshold() {
	// Returns a new, higher or lower threshold value depending on which threshold was met
	posNegCountDifference = Math.abs(runningPositiveCount - runningNegativeCount);
	// console.log("ABSOLUTE VALUE: " + posNegCountDifference);
	// We do need compound if-statements, since sometimes a surprised expression can be perceived as negative, so we should look for compare to both thresholds.
	if (posNegCountDifference >= positiveThreshold && posNegCountDifference <= negativeThreshold) {
		negTresholdMet = false;
		posTresholdMet = true
		// console.log("POSITIVE THRESHOLD MET. ADJUSTING.. ABSOLUTE VALUE: " + posNegCountDifference);
		calculateNewThreshold();
	}
	if (posNegCountDifference >= negativeThreshold && posNegCountDifference <= positiveThreshold) {
		negThresholdMet = true;
		posThresholdMet = false;
		// console.log("NEGATIVE THRESHOLD MET. ADJUSTING.. ABSOLUTE VALUE: " + posNegCountDifference);
		calculateNewThreshold();
	}
	if (posNegCountDifference >= positiveThreshold && posNegCountDifference >= negativeThreshold) {
		negThresholdMet = true;
		posThresholdMet = true;
		// console.log("BOTH THRESHLDS MET. DOING NOTHING. ABSOLUTE VALUE: " + posNegCountDifference);
		calculateNewThreshold();
	}
	if (posNegCountDifference <= positiveThreshold && posNegCountDifference <= negativeThreshold) {
		negThresholdMet = false;
		posThresholdMet = false;
	}
}


//	Thresholds are calculated via square roots for a logarithmic sliding scale
function calculateNewThreshold() {
	if (posThresholdMet == true && negThresholdMet == false) {
		console.log("Previous pos threshold: " + positveThreshold);
		positiveThreshold = positiveThreshold * Math.sqrt(positiveThreshold) / Math.sqrt(positiveThreshold);
		console.log("New pos threshold calculated: " + positiveThreshold);
		// The running total count of the overall negativity should decrease, each time a positive feeling is met, to prevent the video from being changed
		// 		if the user starts to like it more as the video plays through. 
		runningNegativeCount = runningNegativeCount -  Math.sqrt(runningPositiveCount);
		// Since the user is detected to like the video, the program will let the user watch till the end, so save changing to a similar video till the end. 
		//	In the play_video code, when the end of the video is detected, a similar one to it is found, so we don't need to do anything more here.
	}
	if (posThresholdMet == false && negThresholdMet == true) {
		console.log("Previous neg thresold: " + negativeThreshold);
		// negThresholdMet = negativeThreshold * Math.sqrt(negativeThreshold) / (negativeThreshold / Math.sqrt(negativeThreshold));
		console.log("New neg threshold calculated");
		skipVideo();
	}
	if (posThresholdMet == true && negThresholdMet == true) {
		console.log("Previous pos threshold: " + positiveThreshold);
		console.log("Previous neg threshold: " + negativeThreshold);
		console.log("Both new thresholds calculated: " + positiveThreshold + " ; " + negativeThreshold)

		// Lower the thresholds slightly but still logarithimcally
		positiveThreshold = positiveThreshold * Math.sqrt(positiveThreshold) / Math.sqrt(positiveThreshold);
		negThresholdMet = negativeThreshold * Math.sqrt(negativeThreshold) / (negativeThreshold / Math.sqrt(negativeThreshold));
		// skipVideo();
	}
	if (posThresholdMet == false && negThresholdMet == false) {
		return;
	}
}


function findSimilarVideo () {
	console.log("FINDING SIMILAR VIDEO FOR THE NEXT ONE TO PLAY..")
	runningPositiveCount = 0;
	runningNegativeCount = 0;
	positiveThreshold = 100;
    negativeThreshold = positiveThreshold / 1.5;
	getRelated();
	// findSimilarVideo() = function(){}; // kill it as soon as it was called
	return;
	// console.log(similarVideos[0]);
	// player.loadVideoById(similarVideos[0]);
}


function skipVideo () {
	// Reset all values
	runningPositiveCount = 0;
	runningNegativeCount = 0;
	positiveThreshold = 100;
	// Multiply negative here so it doesn't skip again (ensure threshold isn't to low)
    negativeThreshold = positiveThreshold / 1.5;
    console.log(vidCount)
	console.log("VIDEO SKIPPING..");
    // shuffleArray(videoResultsList);
	vidCount = vidCount + 1;
	vidTagID = videoResultsList[vidCount];
	player.loadVideoById(vidTagID);
	resetVideoHeight();
	// skipVideo() = function(){}; // kill it as soon as it was called
	return;
}


// Get value length and use that to adjust the tolerance levels, so longer clips have better chances of staying if the user's been watching them for a while.
// YouTube's API seems impossible to get that without PHP. Maybe try it later, or someone else do it.
function determineVidLength() {
}
{
}

