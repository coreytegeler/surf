window.onYouTubeIframeAPIReady = function() {
	var l = tags.length;
	var i = rand(l);
	var tag = tags[i];
	// console.log(tag);
	findVideo(tag);
}

function findVideo(tag) {
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

var player;
function setupPlayer(id) {
	player = new YT.Player('player', {
	  height: height(),
	  width: width(),
	  videoId: id,
	  playerVars: {
	  	'autoplay' : 1,
	  	// 'controls' : 0
	  },
	  events: {
	    'onReady': onPlayerReady
	  }
	});
}

function onPlayerReady(event) {
	var vid = event.target;
	var dur = vid.getDuration();
	var time = rand(dur);
	vid.setVolume(0);
	vid.seekTo(time, true);
	vid.playVideo();
}

function stopVideo() {
	player.stopVideo();
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