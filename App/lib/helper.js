"use strict";

function Start(file){
    console.log(file);
    var fr = new FileReader(); 
    fr.onloadend = function(event){
        var res = event.target.result;
        //var albumsContent = fr.result;
        console.log(res);             
        var albums = JSON.parse(res);
        CopyAlbums(albums);
    };
    
    fr.readAsBinaryString(file);
}

function CopyAlbums(albums){
    console.log(albums);
    var len = albums.data.length;
    console.log("laenge: " + len);
    for (var i = 0; i < len; i++) {
        var album = albums.data[i];
        console.log(i + "." + "id: " + album.id + " - " + album.title);
    }

    /*albums.data.forEach(function(element) {
        console.log("i" + "id: " + element.id +  + element.title);
    }, this);*/
}

function HandleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    
    Start(files[0]);
}

function Init(){
    document.getElementById('files').addEventListener('change', HandleFileSelect, false);
    
    DZ.init({
		appId  : '214962',
		channelUrl : 'http://localhost/DeezerAccountInfoCopier/App/channel.html'
	});
    document.getElementById('dz-init').innerHTML = 'DZ.SDK initialized';

    //Check if User is logged in
    DZ.getLoginStatus(function(response) {
        if (response.authResponse) {
            console.log("logged in and connected user, someone you know");
        } else {
            console.log("no user session available, someone you dont know");
            Login();
        }
    });
}

function Login(){
    DZ.login(function (response) {
        if (response.authResponse) {
            DZ.api('/user/me', function (response) {
                alert('Good to see you, ' + response.name + '.');
            });
        } else {
            alert('User cancelled login or did not fully authorize.');
        }
    }, { perms: 'manage_community,manage_library,basic_access,email' });
}