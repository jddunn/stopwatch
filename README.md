# StopWatch
StopWatch is a web app that automatically goes through curated content from YouTube based off of the emotional states detected in the viewer by the webcam, utilizing the Affectiva SDK. Made with Bootstrap and jQuery. Comments included in scripts. 

If positive feelings are detected in the viewer, then the current video in the playlist continues playing. If it reaches the end, then the most similar video found on YouTube to the video is played next. If negative emotions are detected, then the current video is skipped, and the next video in the randomized playlist of 50 videos (generated from keywords specified by the user) is played.

Replace the blank API Key (API_KEY) with your client API key from Google Developer's Console (with YouTube Data API enabled), and run a HTTP server (python3 -m http.server in cmd in Windows), since the YouTube API needs a server. 

Flashy ebsite intro
![alt tag](https://github.com/jddunn/stopwatch-master/blob/master/screenshots/stopwatch-site-demo-1.png)

Trying to find 'Hey Now' Performances by London Grammar..
![alt tag](https://github.com/jddunn/stopwatch-master/blob/master/screenshots/stopwatch-site-demo-2.png)

It played Matt & Kim.. Wasn't feeling it, the program picked up negativity, and skipped this video..
![Alt text](https://github.com/jddunn/stopwatch-master/blob/master/screenshots/stopwatch-site-demo-3.png)

Much more about this one; 10/10 joy.
![Alt text](https://github.com/jddunn/stopwatch-master/blob/master/screenshots/stopwatch-site-demo-4.png)
