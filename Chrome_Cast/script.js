var session = null;

window.onload = function() {
	const loadCastInterval = this.setInterval(function() {
		if (chrome.cast.isAvailable) {
			console.log("Cast has loaded.");
			clearInterval(loadCastInterval);
			initializeCastApi();
		} else {
			console.log("Unavailable");
		}
	}, 1000);
};

function initializeCastApi() {
	const applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
	const sessionRequest = new chrome.cast.SessionRequest(applicationID);
	const apiConfig = new chrome.cast.ApiConfig(
		sessionRequest,
		sessionListener,
		receiverListener
	);
	chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
}

function sessionListener(e) {
	session = e;
	console.log("New session");
	if (session.media.length != 0) {
		console.log(`Found ${session.media.length} sessions.`);
	}
}

function receiverListener(e) {
	if (e === "available") {
		console.log("Chromecast was found on the network.");
	} else {
		console.log("There are no Chromecast available");
	}
}

function onInitSuccess() {
	console.log("Initialization succeeded");
}
function onInitError() {
	console.log("Initialization failed");
}

document.querySelector("#castMe").addEventListener("click", (e) => {
	e.preventDefault();
	launchApp();
});

function launchApp() {
	console.log("Launching the Chromecast App...");
	chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onRequestSessionSuccess(e) {
	console.log(`Successfully created session: ${e.sessionId}`);
	session = e;
}

function onLaunchError() {
	console.log("Error connection to the Chromecast.");
}

function onRequestSessionSuccess(e) {
	console.log(`Successfully created session: ${e.sessionId}`);
	session = e;
	loadMedia();
}

function loadMedia() {
	if (!session) {
		console.log("No session.");
		return;
	}

	const mediaInfo = new chrome.cast.media.MediaInfo(
		"https://firebasestorage.googleapis.com/v0/b/metnix-62704.appspot.com/o/Iron_Man.mp4?alt=media&token=0b6aed7e-bc35-4dc8-a5ed-1342ccebfb2c"
	);
	mediaInfo.contentType = "video/mp4";

	const request = new chrome.cast.media.LoadRequest(mediaInfo);
	request.autoplay = true;

	session.loadMedia(request, onLoadSuccess, onLoadError);
}

function onLoadSuccess() {
	console.log("Success");
}

function onLoadError(err) {
	console.log("err");
}

function stopApp() {
	const status = chrome.cast.requestSession.STOPPED;
	session.stop(onRequestSessionSuccess, onLaunchError);
}

document.querySelector("#stopMe").addEventListener("click", (e) => {
	stopApp();
});
