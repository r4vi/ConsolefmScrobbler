var title_string;
var artist_string;
var chat_message;
var existing_track_message;
var lastfm_token;
var session_token;
var VERSION_NO = 0.3

var api_key = "67016c58ec7a4183202d00c9f03e38e3";
var api_secret = "3820b02fc1e7d42f61ccb30e7436e945";

console.log('ConsolefmScrobbler loaded.');

check_for_authentication();

function checkForChange() {
	//Uses the " started playing "Ayo For Yayo" by Andre Nickatina" string
	
	track_title = document.querySelector('div#now_playing > div > h2 > span#track-title').innerText + ' - ' + document.querySelector('div#now_playing > div#track-info > h3').innerText
	
	//Make sure there's crap in the chat box first
		
		//console.log("Existing is: "+existing_track_message + " New is: "+chat_message);
		
		if (track_title != existing_track_message) {
			existing_track_message = track_title;
			
			//Figure out the artist and track
			track_string = document.querySelector('div#now_playing > div > h2 > span#track-title').innerText;
			artist_string = document.querySelector('div#now_playing > div#track-info > h3').innerText;
;

			//Figure out the track length
			//length_raw_string = document.getElementById('songboard_title').innerHTML;
			//track_length = length_raw_string.substr(length_raw_string.indexOf(" - ") + 3);
			
		
			console.log("Scrobbling: " + artist_string + " - " + track_string);
			
			scrobble(artist_string,track_string,localStorage["lastfm-session-token"]);
			
		}
	}
	

function get_authenticated() {
	var method = 'POST';
	var callback = chrome.extension.getURL("authenticate.html");
  	var url = 'http://www.last.fm/api/auth/?api_key='+api_key+"&cb="+callback;

	javascript:window.open(url);
}


function check_for_authentication() {
	chrome.extension.sendRequest({method: "getSession"}, function(token) {
		localStorage["lastfm-session-token"] = token;
		console.log("Reieved session: "+token);
	});
	
	//console.log(token);
    
    if (!localStorage["consolefmscrobbler-version"])
    {
        localStorage["consolefmscrobbler-version"] = VERSION_NO
    } else {
        if (VERSION_NO !=  localStorage["consolefmscrobbler-version"])
        {
            window.localStorage.removeItem("lastfm-session-token");
            window.localStorage.removeItem("lastfm_token");
        }
    }
	
	if (!localStorage["lastfm-session-token"]) {
		window.localStorage.removeItem("lastfm-session-token");
		window.localStorage.removeItem("lastfm_token");
		
		get_authenticated();
		console.log("No authentication token.  Resolving that.");
	} else {
		console.log("Found authentication token.  Moving on.");
				
		setInterval("checkForChange()",1000);
		lastfm_token = localStorage["lastfm_token"];
		lastfm_session_token = localStorage["lastfm-session-token"];
	}
}

function scrobble(artist,track,session) {
	console.log("Sending scrobble request");
	
	chrome.extension.sendRequest({method: "scrobbleTrack",artist: artist, track: track, session_token: session});

}








