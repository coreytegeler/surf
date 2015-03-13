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
	findVideos();

	setTimeout(function() {
		$body.addClass('intro');
		instructions();
	},1000);

	setTimeout(function() {
		$('#logo').addClass('bobbing');
	},2500);
});

function instructions() {
	$slides = $('#instructions .slide');
	setTimeout(function() {
		$slides.eq(0).addClass('show');
	},1400);
	var slideCount = $slides.length;

	$('#instructions .slide#begin .next img').click(function() {
		$('#instructions .slide#begin').addClass('done');
		$('#instructions .slide#ask-permission').addClass('show');
		setTimeout(function() {
			initWebcam();
		},500);
	});

	$('#instructions .slide#start-surfing .next img').click(function() {
		$('#instructions .slide#start-surfing').addClass('done');
		startSurfing();
	});

	$('#instructions .slide .next img').hover(function() {
		$img = $(this);
		var url = $img.attr('src');
		var newUrl = url.replace("-w.svg", ".svg");
		$img.attr('src', newUrl);
	}, function() {
		$img = $(this);
		var url = $img.attr('src');
		var newUrl = url.replace(".svg", "-w.svg");
		$img.attr('src', newUrl);
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
			// console.log('Woo!')
		}
	});
}

var queriedVideos = [];
function findVideos() {
	var l = tags.length;
	var i = rand(l) - 1;
	var tag = tags[i];
	console.log(i, l, tag);
	var key = 'AIzaSyD7UE-orpOJW1DBo6Z-rAMCAEjQbVZEvfg';
	var order = 'rating';
	var query = tag;
	var queryCount = 10;
	var yt = 'https://www.googleapis.com/youtube/v3/search?order=' + order + '&part=id&q=' + query + '&maxResults=' + queryCount + '&key=' + key;
	$.get( yt, function(data) {
	  for (var i = 0; i < data.items.length; i++) {
	  	queriedVideos.push(data.items[i]);	
	  }
	  if (surfing == false) {
	  	setupPlayer();
	  } else {
	  	playNewVideo();
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
	playNewVideo(event);
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

		$play.click(function() {
			$('#logo').removeClass('bobbing');
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
		// 		playNewVideo();
		// 	}
		// },1000);
	} else if (stateInt == 3 && surfing == true) {
		$body.addClass('buffering');
		$body.removeClass('playing');
		buffering = true;
		playing = false;
	} else if (stateInt == 0) {
		playNewVideo();
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
	$('#logo').addClass('surfing');
}
var queryIndex = 0;
function playNewVideo() {
	var queriedVideo = queriedVideos[queryIndex];
	var id = queriedVideo.id.videoId;
	player.loadVideoById(id);
	player.setVolume(100);
	queryIndex = queryIndex + 1;
	if(queryIndex == queriedVideos.length - 1) {
		findVideos();
	}
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
	camCanvas = camBox.getElementsByTagName('canvas')[0];
	ctx = camCanvas.getContext('2d');
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
    	$('#instructions .slide#ask-permission').addClass('done');
      	$('#instructions .slide#no-webcam').addClass('show');
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
    ctx.clearRect(0,0,camCanvas.width,camCanvas.height);
    if (tracker.getCurrentPosition()) {
    	var accuracy = tracker.getScore();
    	$('#face').css({'opacity': Math.round(accuracy*10)/10});
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

    		if(dislike >= 50) {
    			scanCount = 0;
    			dislike = 0;
    			like = 0;
    			queryIndex = 0;
    			queriedVideos = [];
    			findVideos();
    			if (responding == false) {
	    			var maxValue = Math.max.apply(null, emotionalValues);
	    			var maxIndex = emotionalValues.indexOf(maxValue);
	    			var maxEmotion = emotions[maxIndex].emotion;
    				respond(maxEmotion);
    			}
    		} else if(dislike <= -100) {
    			if (responding == false) {
    				dislike = 0;
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

	    	if (accuracy < 0.7 && $('body').hasClass('surfing')) {
	    		inaccuracy = inaccuracy + 1;
				if(inaccuracy > 200) {
					togglePause('inaccurate');
					for (var i=0; i < 4; i++) {
		    			$('#emotions .emotion:eq('+i+')').children('.value').animate({
		    				'width': 0,
		    				'opacity': 0
		    			},300);
		    		}
		    	}
		    	else {
		    		togglePause('play');		
		    	}
			} else {
				inaccuracy = inaccuracy - 1;
			}	
	    }
		tracker.draw(camCanvas);
    } else if($('body').hasClass('surfing')) {
    	togglePause('no-face');
    }
}

function respond(emotion) {
	responding = true;
	console.log(emotion);
	var types = ['text', 'emoticon'];
	var type = types[Math.round(Math.random(1))];
	var responseArray = responses[emotion][type];
	var response = responseArray[Math.round(Math.random(responseArray.length))];

	console.log(response);

	// 

	$('#logo').addClass('hide');
	$('#responses .response').removeClass('show');
	setTimeout(function() {
		$('#responses .response .text').text(response);
		$('#responses .response').addClass('show');
	}, 350);

	setTimeout(function() {
		$('#responses .response').removeClass('show');

		setTimeout(function() {
			$('#logo').removeClass('hide');
		}, 350);

		setTimeout(function() {
			responding = false;
		}, 6000);
	}, 5000);
}


var isTalking = false;
function togglePause(reason) {
	$overlay = $('#pauseOverlay #'+reason);
	if(reason == 'play') {
		inaccuracy = 0;
		if(!isTalking) {
			$('body').removeClass('paused');
			$('#pauseOverlay .show').removeClass('show');
			// talk('Thank you, enjoy the video');
			player.playVideo();
			hasTalked = false;
		}
	} else if (!$('#pauseOverlay .show').length) {
		$overlay.addClass('show');
		$('body').addClass('paused');
		player.pauseVideo();
		var text = $('#pauseOverlay #'+reason).text();
		talk(text);
	}
}
var tts = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
var hasTalked = false;
function talk(text) {
	if(!hasTalked) {
		isTalking = true;
		tts.voice = voices[1]; // Note: some voices don't support altering params
		tts.voiceURI = 'native';
		tts.volume = 1; // 0 to 1
		tts.rate = 1; // 0.1 to 10
		tts.pitch = 2; //0 to 2
		tts.text = text;
		tts.lang = 'en-US';
		hasTalked = true;
		tts.onend = function(e) {
	  		isTalking = false;
		};
		speechSynthesis.speak(tts);
		console.log(text);
	}
}
