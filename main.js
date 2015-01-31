var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
	  height: '390',
	  width: '640',
	  playerVars: {
	  	'autoplay' : 1,
	  	'controls' : 0
	  },
	  events: {
	    'onReady': getId
	  }
	});
}

//https://developers.google.com/youtube/v3/docs/search/list
function getId() {
	var key = 'AIzaSyD7UE-orpOJW1DBo6Z-rAMCAEjQbVZEvfg';
	var order = 'rating';
	var query = 'lol';
	var count = 20;
	var yt = 'https://www.googleapis.com/youtube/v3/search?order=' + order + '&part=id&q=' + query + '&maxResults=' + count + '&key=' + key;

	$.get( yt, function(data) {
	  var videos = data.items;
	  var index = Math.floor((Math.random() * count) + 1);
	  var video = videos[index];
	  var id = video.id.videoId;
	  player.videoId = id;
	});
}

function onPlayerReady(event) {
	var vid = event.target;
	vid.playVideo();
}

function stopVideo() {
	player.stopVideo();
}
