

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
	  height: '390',
	  width: '640',
	  videoId: 'k51cnVcbUAo',
	  playerVars: {
	  	'autoplay' : 1,
	  	'controls' : 0
	  },
	  events: {
	    'onReady': onPlayerReady
	  }
	});
}

function onPlayerReady(event) {
	var vid = event.target;
	vid.playVideo();
	vid.setVolume(0);
}

function stopVideo() {
	player.stopVideo();
}