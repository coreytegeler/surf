var ytReady;
var player;
var video;
var surfing = false;
var buffering = false;
var playing = false;

window.onYouTubeIframeAPIReady = function() {
	ytReady = true;
}

$(window).load(function() {
	$play = $('#surf');
	$waves = $('#waves');
	$body = $('body');
	getTag();

	setTimeout(function() {
		$body.addClass('intro');
		instructions();
	},1000);

	setTimeout(function() {
		$('#logoBig').addClass('bobbing');
	},2500);
});

function instructions() {
	$slides = $('#instructions .slide');
	setTimeout(function() {
		$slides.eq(0).addClass('show');
	},1400);
	var slideCount = $slides.length;

	$('#instructions .slide#begin .next').click(function() {
		$('#instructions .slide#begin').addClass('done');
		$('#instructions .slide#ask-permission').addClass('show');
		setTimeout(function() {
			initWebcam();
		},500);
	});

	$('#instructions .slide#start-surfing .next').click(function() {
		$('#instructions .slide#start-surfing').addClass('done');
		startSurfing();
	});



	// $slides.children('.inner').children('.text').children('.next').click(function() {
	// 	$slide = $(this).parent('.text').parent('.inner').parent('.slide');

	// 	$slide.addClass('done');

	// 	if($slide.is(':first-child')) {
	// 		setTimeout(function() {
	// 			initWebcam();
	// 		},500);
	// 	}

	// 	if(!$slide.is(':last-child')) {
	// 		$($slide[0].nextElementSibling).addClass('show');
	// 	} else {
	// 		startSurfing();
	// 	}
	// });
}

function getTag() {
	var l = tags.length;
	var i = rand(l);
	var tag = tags[i];
	findVideos(tag);
	// authorize();
}

function authorize() {
	var base = "https://accounts.google.com/o/oauth2/auth";
	var client_id = "936413705890-i0fdiflilt20fta2g6l7892uq2i09qg6.apps.googleusercontent.com";
	var redirect_uri = "https://www.coreytegeler.com/";
	var scope = "https://www.googleapis.com/auth/youtube.readonly";
	var response_type = "token";
	var authUri = base + "?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&scope=" + scope + "&response_type=" + response_type;
	$.ajax({
		type: "GET",
		url: authUri,
		xhrFields: {
			withCredentials: false
		},
		headers: {
			AccessControlAllowOrigin: "*"
		},
		success: function() {
			console.log('Woo!')
		}
	});
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
	  height: height() - 100,
	  width: width(),
	  playerVars: {
	  	'autoplay' : 0,
	  	'controls' : 0
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
		buffering = false;
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

		$body.addClass('ready').removeClass('waiting');

		var sunWrap = document.getElementById("sunWrap");
		PrefixedEvent(sunWrap, "AnimationEnd", function() {
			$('#sunWrap').addClass('bobbing');
		});

		$play.click(function() {
			$('#logoBig').removeClass('bobbing');
			startSurfing();
		});
	} else if (stateInt == 1) {
		// var dur = video.getDuration();
		// startTime = rand(dur);
		// var newDur = dur - startTime;
		// endTime = rand(dur);
		// endTime = startTime + 10;

		// window.setInterval(function() {
		// 	// var dur = video.getDuration();
		// 	var currentTime = video.getCurrentTime();
		// 	var endTime = currentTime + rand(8) - 1;
		// 	console.log(currentTime, endTime);
		// 	if(currentTime >= endTime) {
		// 		queueNewVideo();
		// 	}
		// },1000);
	} else if (stateInt == 3 && surfing == true) {
		$body.addClass('buffering');
		$body.removeClass('playing');
		buffering = true;
		playing = false;
	} else if (stateInt == 0) {
		queueNewVideo();
	}

	if (stateInt == 1 && surfing == true) {
		$body.addClass('playing');
		playing = true;
	}
}

function startSurfing() {
	surfing = true;
	video.playVideo();
	$body.removeClass('ready intro');
	$body.addClass('surfing');
}

function queueNewVideo(event) {
	var queryCount = queriedVideos.length;
	var index = rand(queryCount) - 1;
	var queriedVideo = queriedVideos[index];
	var id = queriedVideo.id.videoId;
	player.loadVideoById(id);
	player.setVolume(0);
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
		player.setSize(width(), height() - 100);
	}
});


$(document).ready(function() {
	camBox = document.getElementById('webcam');
	camVid = camBox.getElementsByTagName('video')[0];
	camCan = camBox.getElementsByTagName('canvas')[0];
	ctx = camCan.getContext('2d');
});

var tracker = new clm.tracker();
function initWebcam() {
  if (Modernizr.getusermedia) {
    var userMedia = Modernizr.prefixed('getUserMedia', navigator);
    userMedia({video:true}, function(localMediaStream) {
      stream = localMediaStream;
      camVid.src = window.URL.createObjectURL(stream);
      $('#webcam video').on('loadedmetadata', function() {
      	$('#instructions .slide#ask-permission').addClass('done');
      	$('#instructions .slide#start-surfing').addClass('show');
        tracker.init(pModel);
        camVid.play();
		tracker.start(camVid);
		drawLoop();
      });
    }, function() {
      // alert('Failed');
    });
  }
}

ec = new emotionClassifier();
ec.init(emotionModel);
emotionData = ec.getBlank();
var dislike = 0;
var like = 0;
var scanCount = 0;
var responding = false;
var inaccuracy = 0;
function drawLoop() {
    requestAnimationFrame(drawLoop);
    ctx.clearRect(0,0,camCan.width,camCan.height);
    if (tracker.getCurrentPosition()) {
    	var accuracy = tracker.getScore();
    	$('#face').css({'opacity': Math.round(accuracy*10)/10});
    	if (accuracy > 0.75) {
	    	var cp = tracker.getCurrentParameters();      
	    	var emotions = ec.meanPredict(cp);
	    	if(emotions && playing) {
	    		var angry = emotions[0].value;
	    		var sad = emotions[1].value;
	    		var surprised = emotions[2].value;
	    		var happy = emotions[3].value;
	    		var emotionalValues = [angry, sad, surprised, happy];
	    		scanCount+=1;
	    		if(scanCount >= 1000) {
	    			scanCount = 0;
	    			dislike = 0;
	    			like = 0;
	    		}
	    		dislike = dislike + (angry + sad - happy - surprised);

	    		if(dislike >= 25) {
	    			scanCount = 0;
	    			dislike = 0;
	    			like = 0;
	    			console.log('NEW VIDEO');
	    			queueNewVideo();
	    			if (responding == false) {
		    			var maxValue = Math.max.apply(null, emotionalValues);
		    			var maxIndex = emotionalValues.indexOf(maxValue);
		    			var maxEmotion = emotions[maxIndex].emotion;
	    				respond(maxEmotion);
	    			}
	    		} else if(dislike <= -50) {
	    			if (responding == false) {
		    			var maxValue = Math.max.apply(null, emotionalValues);
		    			var maxIndex = emotionalValues.indexOf(maxValue);
		    			var maxEmotion = emotions[maxIndex].emotion;
	    				respond(maxEmotion);
	    			}
	    		}

	    		for (var i=0; i < emotions.length; i++) {
	    			var value = Math.round(emotions[i].value*100);

	    			$('#emotions .emotion:eq('+i+')').children('.value').css({
	    				'width': value,
	    				'opacity': value/50
	    			});
	    		}
		    }
		    if($('body').hasClass('surfing') && $('body').hasClass('paused')) {
		    	$('body').removeClass('paused');
		    	player.playVideo();
		    }
		
		} else {
			inaccuracy = inaccuracy + 1;
			console.log(inaccuracy);
			if($('body').hasClass('surfing') && inaccuracy > 300) {
				inaccuracy = 0;
				$('body').addClass('paused');
				player.pauseVideo();
			}
			for (var i=0; i < 4; i++) {
    			$('#emotions .emotion:eq('+i+')').children('.value').animate({
    				'width': 0,
    				'opacity': 0
    			},300);
    		}
		}
	    tracker.draw(camCan);
    }
}

function respond(emotion) {
	responding = true;
	console.log(emotion);
	var types = ['text', 'emoticon'];
	var type = types[Math.round(Math.random(1))];
	var possibleResponse = responses[emotion][type];
	var response = possibleResponse[Math.round(Math.random(possibleResponse.length))];
	$('body').addClass('responding');
	$('#responses .response .text').text(response);

	setTimeout(function() {
		responding = false;
		$('body').removeClass('responding');
	}, 3000);
}