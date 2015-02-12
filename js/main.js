var ytReady;
var player;
var surfing = false;
var video;

window.onYouTubeIframeAPIReady = function() {
	ytReady = true;
}

$(window).load(function() {
	$play = $('#playBtn');
	$waves = $('#waves');
	$body = $('body');
	getTag();
});

function getTag() {
	var l = tags.length;
	var i = rand(l);
	var tag = tags[i];
	findVideos(tag);
}

var queriedVideos;
function findVideos(tag) {
	console.log(tag);
	var key = 'AIzaSyD7UE-orpOJW1DBo6Z-rAMCAEjQbVZEvfg';
	var order = 'rating';
	var query = tag;
	var queryCount = 50;
	var yt = 'https://www.googleapis.com/youtube/v3/search?order=' + order + '&part=id&q=' + query + '&maxResults=' + queryCount + '&key=' + key;
	$.get( yt, function(data) {
	  queriedVideos = data.items;
	  if (surfing == false) {
	  	setupPlayer();
	  } else {
	  	queueNewVideo();
	  }
	});
}

var playerCount = 0;
function setupPlayer(qV) {
	player = new YT.Player('player1', {
	  height: height(),
	  width: width(),
	  // videoId: id,
	  playerVars: {
	  	'autoplay' : 0,
	  	// 'controls' : 0
	  },
	  events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}

function onPlayerReady(event) {
	video = event.target;
	queueNewVideo(event);
}


function onPlayerStateChange(event) {
	var stateInt = event.data;
	var states = [
		'unstarted',  // -1	
		'ended', 	  //  0
		'playing', 	  //  1
		'paused', 	  //  2
		'buffering',  //  3	
		'idk', 		  //  4
		'video cued'  //  5
	];
	var state = states[stateInt + 1];
	console.log(stateInt + ' ' + state);

	if(stateInt != 3) {
		$body.removeClass('buffering');
	}

	//If video loaded to rand time and began to play -> pause video and allow user to start
	if (stateInt == 1 && surfing == false) {
		video.pauseVideo();

		var dur = video.getDuration();
		startTime = rand(dur); //prevent this from loading too close to the end!!
		var newDur = dur - startTime;
		// endTime = rand(dur); //prevent this from ending too close to the start!!
		// endTime = startTime + 5;
		video.seekTo(startTime, true);

		$body.addClass('ready');

		var playBtnWrp = document.getElementById("playBtnWrp");
		PrefixedEvent(playBtnWrp, "AnimationEnd", function() {
			$('#playBtnWrp').addClass('bobbing');
		});

		$('#playBtn').click(function() {
			startSurfing();
		});
	} else if (stateInt == 1) {
		// var dur = video.getDuration();
		// startTime = rand(dur);
		// var newDur = dur - startTime;
		// endTime = rand(dur);
		// endTime = startTime + 10;

		window.setInterval(function() {
			// var dur = video.getDuration();
			var currentTime = video.getCurrentTime();
			var endTime = currentTime + rand(8) - 1;
			console.log(currentTime, endTime);
			if(currentTime >= endTime) {
				queueNewVideo();
			}
		},1000);
	} else if (stateInt == 3 && surfing == true) {
		$body.addClass('buffering');
	} else if (stateInt == 0) {
		queueNewVideo();
	}
}

function startSurfing() {
	surfing = true;
	video.playVideo();
	$body.removeClass('ready');
	$body.addClass('surfing');
}

function queueNewVideo(event) {
	var queryCount = queriedVideos.length;
	var index = rand(queryCount) - 1;
	var queriedVideo = queriedVideos[index];
	var id = queriedVideo.id.videoId;
	player.loadVideoById(id);
}

function stopVideo() {
	vid.stopVideo();
}

function width() {
	return window.innerWidth;
}

function height() {
	return window.innerHeight;
}

function rand(x) {
	return Math.floor((Math.random() * x) + 1);
}


//http://www.sitepoint.com/css3-animation-javascript-event-handlers/
var pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}

$(window).resize(function() {
	if(player) {
		player.setSize(width(), height());
	}
});


// $(document).ready(function() {
// 	camBox = document.getElementById('webcam');
// 	camVid = camBox.getElementsByTagName('video')[0];
// 	camCan = camBox.getElementsByTagName('canvas')[0];
// 	ctx = camCan.getContext('2d');
// 	initWebcam();
// });

// var tracker = new clm.tracker();
// function initWebcam() {
//   if (Modernizr.getusermedia) {
//     var userMedia = Modernizr.prefixed('getUserMedia', navigator);
//     userMedia({video:true}, function(localMediaStream) {
//       stream = localMediaStream;
//       camVid.src = window.URL.createObjectURL(stream);
//       $('#webcam video').on('loadedmetadata', function() {
//         tracker.init(pModel);
//         camVid.play();
// 		tracker.start(camVid);
// 		drawLoop();
//       });
//     }, function() {
//       alert('Failed');
//     });
//   }
// }

// ec = new emotionClassifier();
// ec.init(emotionModel);
// emotionData = ec.getBlank();
// function drawLoop() {
//     requestAnimationFrame(drawLoop);
//     if (tracker.getCurrentPosition()) {
//     	var cp = tracker.getCurrentParameters();      
//     	var emotion = ec.meanPredict(cp);
//     	if(emotion) {
// 	    	var smile = emotion[3].value;
// 	    	if(smile > 0.6) {
// 	    		console.log(smile);
// 	    	}
// 	    }
//       	tracker.draw(camCan);
//     }
// }