var session = null;

	window.onload = function() {
		const loadCastInterval = this.setInterval(function() {
			if (chrome.cast.isAvailable) {
				clearInterval(loadCastInterval);
				initializeCastApi();
			} else {
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
		if (session.media.length != 0) {
		}
	}

	function receiverListener(e) {
		if (e === "available") {
		} else {
		}
	}

	function onInitSuccess() {}
	function onInitError() {}

	document.querySelector(castBtn).addEventListener("click", (e) => {
		e.preventDefault();
		launchApp();
	});

	function launchApp() {
		chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
	}

	function onRequestSessionSuccess(e) {
		session = e;
	}

	function onLaunchError() {}

	function onRequestSessionSuccess(e) {
		session = e;
		loadMedia();
	}

	function loadMedia() {
		if (!session) {
			return;
		}

		const mediaInfo = new chrome.cast.media.MediaInfo(src);
		mediaInfo.contentType = "video/mp4";

		const request = new chrome.cast.media.LoadRequest(mediaInfo);
		request.autoplay = true;

		session.loadMedia(request, onLoadSuccess, onLoadError);
	}

	function onLoadSuccess() {}

	function onLoadError(err) {}

	function stopApp() {
		const status = chrome.cast.requestSession.STOPPED;
		session.stop(onRequestSessionSuccess, onLaunchError);
	}
