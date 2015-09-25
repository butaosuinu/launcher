var playlist = window.playlist;
var playlist_elm = [];
var playIndex = -1;

(function(){
	for(var i=0; i < playlist.length; i++){
		var elm = document.createElement("li");
		elm.setAttribute("src", "music/" + playlist[i].composer + "/" + playlist[i].file_name);
		elm.innerHTML = playlist[i].composer + " / " + playlist[i].title;
		elm.setAttribute("index", i);
		elm.addEventListener("click", musicPlay);
		document.getElementById("playlist").appendChild(elm);
	}
	playlist_elm = document.getElementById("playlist").childNodes;
})();

function musicPlay(event){
	var index = event.target.getAttribute("index");
	if(playIndex!=-1){
		playlist_elm[playIndex].style.backgroundColor = "#fff";
	}
	playlist_elm[index].style.backgroundColor = "#eee";
	document.getElementById("audio_player").src = playlist_elm[index].getAttribute("src");
	playIndex = index;
}
