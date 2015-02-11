var ytReady;
var player;

window.onYouTubeIframeAPIReady = function() {
	ytReady = true;
}

$(window).load(function() {
	var l = tags.length;
	var i = rand(l);
	var tag = tags[i];
	$play = $('#playBtn');
	$waves = $('#waves');
	findVideo(tag);
});

function findVideo(tag) {
	console.log(tag);
	var key = 'AIzaSyD7UE-orpOJW1DBo6Z-rAMCAEjQbVZEvfg';
	var order = 'rating';
	var query = tag;
	var count = 50;
	var yt = 'https://www.googleapis.com/youtube/v3/search?order=' + order + '&part=id&q=' + query + '&maxResults=' + count + '&key=' + key;
	$.get( yt, function(data) {
	  var videos = data.items;
	  var index = rand(count);
	  var video = videos[index];
	  var id = video.id.videoId;
	  setupPlayer(id);
	});
}


function setupPlayer(id) {
	console.log(id);
	player = new YT.Player('player', {
	  height: height(),
	  width: width(),
	  videoId: id,
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
	vid = event.target;
	vid.setVolume(0);
	var dur = vid.getDuration();
	var time = rand(dur);
	vid.seekTo(time, true);
}

var surfing = false;
function onPlayerStateChange(event) {
	var state = event.data;
	// -1	 unstarted
	// 0	 ended
	// 1	 playing
	// 2	 paused
	// 3	 buffering
	// 5	 video cued
	console.log(state);

	//If video loaded to rand time and began to play -> pause video and allow user to start
	if (state == 1 && surfing == false) {
		vid.pauseVideo();
		$('body').addClass('ready');

		var playBtnWrp = document.getElementById("playBtnWrp");
		PrefixedEvent(playBtnWrp, "AnimationEnd", function() {
			$('#playBtnWrp').addClass('bobbing');
		});

		
		
		$('#playBtn').click(function() {
			startSurfing();
		});
	}
}

function startSurfing() {
	surfing = true;
	$('body').removeClass('ready');
	$('body').addClass('surfing');
	vid.playVideo();
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