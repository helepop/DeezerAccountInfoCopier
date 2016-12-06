"use strict";

var myWorker;
var accessToken;
var output = [];

function Start(files) {
    myWorker.onmessage = function(e) {
        for (var j = 0, data; data = e.data[j]; j++) {
            output.push('<p><b>' + data.filename + '</b></p>');
            document.getElementById('Results').innerHTML = output.join('');
            copyContent(data.content);
        }
    };

    myWorker.postMessage(files);
}

function copyContent(content) {
    var id, name, type;
    for (var j = 0, data; data = content.data[j]; j++) {
        console.log('data: ' + data);
        type = data.type;
        if (data.type != 'playlist') {
            id = data.id;
            if (data.type != 'artist')
                name = data.title;
            else
                name = data.name;

            var apiCall = 'user/1240636962/' + data.type + 's';
            console.log('apiCall: ' + apiCall + " - " + id + " " + name);
            output.push(j + 1, ' apiCall: ', apiCall, " ", type, ": ", id, " ", name, '<br />');
            switch (type) {
                case "album":
                        copyAlbum(id, apiCall);
                    break;
                case "artist":
                        copyArtist(id, apiCall);    
                    break;
                case "track":
                        copyTrack(id, apiCall);
                    break;
            
                default:
                    console.log("Type: " & type & "not supported");
                    break;
            }
            document.getElementById('Results').innerHTML = output.join('');
        }
    }
}

function copyAlbum(albumId, apiCall){
    if(albumId == "") return;

    DZ.api(apiCall, 'POST', { album_id: albumId }, function (response) {
        if (response.error) {
            var error = response.error;
            console.log(error.message);
        } else {
            console.log(1 + "." + "id: " + response.id + " - " + response.title);
        }
    });
}

function copyArtist(artistId, apiCall){
    if(artistId == "") return;
    
    DZ.api(apiCall, 'POST', { artist_id: artistId }, function (response) {
        if (response.error) {
            var error = response.error;
            console.log(error.message);
        } else {
            console.log(1 + "." + "id: " + response.id + " - " + response.title);
        }
    });
}

function copyTrack(trackId, apiCall){
    if(trackId == "") return;

    DZ.api(apiCall, 'POST', { track_id: trackId }, function (response) {
        if (response.error) {
            var error = response.error;
            console.log(error.message);
        } else {
            console.log(1 + "." + "id: " + response.id + " - " + response.title);
        }
    });
}


function HandleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    Start(files);
}

function Init(worker) {
    var userid;
    myWorker = worker;
    document.getElementById('files').addEventListener('change', HandleFileSelect, false);

    DZ.init({
        appId: '214962',
        channelUrl: 'http://localhost/DeezerAccountInfoCopier/App/channel.html'
    });
    document.getElementById('dz-init').innerHTML = 'DZ.SDK initialized';

    //Check if User is logged in
    DZ.getLoginStatus(function(response) {
        if (response.authResponse) {
            console.log("logged in and connected user, someone you know");
            accessToken = response.authResponse.accessToken;
            userid = response.id;
        } else {
            console.log("no user session available, someone you dont know");
            userid = Login();
        }
    });

    getOwnInformtions(userid);
}

function Login() {
    var userid;
    DZ.login(function(response) {
        if (response.authResponse) {
            DZ.api('/user/me', function(response) {
                alert('Good to see you, ' + response.name + '.');
            });
            accessToken = response.authResponse.accessToken;
            userid = userID;
        } else {
            alert('User cancelled login or did not fully authorize.');
        }
    }, {
        perms: 'manage_community,manage_library,basic_access,email'
    });
    return userid;
}

function getOwnInformtions(userID) {
    var res;
    if (userID != "") {
        DZ.api('/user/' + userID, function(response) {
            res = response;
            console.log("My name", response.name);
        });
    } else {
        DZ.api('/user/me', function(response) {
            res = response;
            console.log("My name", response.name);
        });
    }
    return res;
}