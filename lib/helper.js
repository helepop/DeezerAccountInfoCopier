"use strict";

function start(file){
    console.log(file);
    var fr = new FileReader();
    var AlbumsJSONLoaded = function(event){

        var res = event.target.result;
        var albumsContent = fr.result;
        console.log(albumsContent);             
        var albums = JSON.parse(albumsContent);
        CopyAlbums(albums);
    }
    fr.onloadend = AlbumsJSONLoaded;
    
    fr.readAsBinaryString(file);
}

function CopyAlbums(albums){
    console.log(albums);
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    
    start(files[0]);
}

function init(){
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    
    DZ.init({
		appId  : '214962',
		channelUrl : './App/channel.html'
	});
    document.getElementById('dz-init').innerHTML = 'DZ.SDK initialized';

        //Check if User is logged in
    DZ.getLoginStatus(function(response) {
        if (response.authResponse) {
            Console.log("logged in and connected user, someone you know");
        } else {
            Console.log("no user session available, someone you dont know");
        }
    });
}
