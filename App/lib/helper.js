"use strict";



var myWorker;
var accessToken;
var output = [];

// Playlists
var sourcePlayListData;
var TargetPLayListData;

/*function Start(files) {
    for(var f=0, file; file = files[f]; f++){
        ReadFile(file);
    }
}

function ReadFile(file){
    var reader = new FileReader();
    var filename = file.name;
    reader.onload = function(event, filename) {  
        var content = JSON.parse(event.target.result);
        output.push('<p><b>' + filename + '</b></p>');
        document.getElementById('Results').innerHTML = output.join('');
        copyContent(content);
    };
    reader.readAsBinaryString(file);
} */

function copyContent(content, type, callback){
    var id, name;
    for (var j = 0, data; data = content.data[j]; j++) {
        //console.log('data: ' + data);
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
                copyAlbum(data, apiCall);
                break;
            case "artist":
                copyArtist(id, apiCall);    
                break;
            case "track":
                copyTrack(id, apiCall);
                break;
            case "playlist":
                console.log("Playlist: " + data)
                copyPlayList(data, apiCall);
                break;        
            default:
                console.log("Type: " & type & "not supported");
                break;
        }
    }
}

function copyAlbum(album, apiCall){
    if(album === undefined) return;
    var albumId = album.id;
    DZ.api(apiCall, 'POST', { album_id: albumId }, function (response) {
        if (response.error != "") {
            var error = response.error;
            console.log(error.message);
        } else {
            console.log(1 + "." + "id: " + response.id + " - " + response.title);
            /*output.push(j + 1, ' apiCall: ', apiCall, " ", type, ": ", id, " ", name, '<br />');
            document.getElementById('Results').innerHTML = output.join('');*/
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

function copyPlayList(sourceplaylist, apiCall){
    if(sourceplaylist == undefined) return;

    var name = sourceplaylist.title;
    var targetPlaylist = TargetPLayListData.filter(function(PlayList){
        return PlayList.title == name;
    })
    if(targetPlaylist != undefined){
        //var targetPlaylistId = targetPlaylist[0].id;
        apiCall = sourceplaylist.tracklist.replace("http://api.deezer.com/","");
        DZ.api(apiCall, function(e){
            var sourceSongs = e.data;
            var songs = "", count = sourceSongs.length - 1;
            for(var sourceSong in sourceSongs){
                if(sourceSong < count)
                    songs = songs + sourceSongs[sourceSong].id + ","
                else
                    songs = songs + sourceSongs[sourceSong].id
            }

            function copySongs(songs, callback){
                apiCall = "playlist/" + targetPlaylist[0].id + "/tracks"
                DZ.api(apiCall, 'POST', { songs: songs }, function (response) {
                    console.log("CopySongs - apiCall: " + apiCall + "songs: " + songs);
                    callback(response)
                });
            }
            
            copySongs(songs, function(response){
                if (response.error == "") {
                    var error = response.error;
                    console.log(error.message);
                } else {
                    
                    /*output.push(j + 1, ' apiCall: ', apiCall, " ", type, ": ", id, " ", name, '<br />');
                    document.getElementById('Results').innerHTML = output.join('');*/
                }
            })
        })
    }
    

    
    /*DZ.api(apiCall, 'POST', { title: data.title }, function (response) {
        if (response.error) {
            var error = response.error;
            console.log(error.message);
        } else {
            console.log(1 + "." + "id: " + response.id + " - " + response.title);
        }
    });*/
}

function HandleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    myWorker.onmessage = function(e) {
        for (var j = 0, data; data = e.data[j]; j++) {
            output.push('<p><b>' + data.filename + '</b></p>');
            document.getElementById('Results').innerHTML = output.join('');
            
            var type = data.content.data[0].type;            
            if(type == "playlist"){
                sourcePlayListData = data.content;
                function prepareCopyPlayList(fn) {
                    DZ.api('user/1240636962/playlists?limit=100', function(e) {
                        TargetPLayListData = e.data;
                        fn(sourcePlayListData)
                    })    
                }
                
                prepareCopyPlayList(function(sourcePlayListData){
                    copyContent(sourcePlayListData,type, function(){
                        document.getElementById('Results').innerHTML = output.join('');
                    });
                })
            }else{ 
                copyContent(data.content,type, function(){
                    document.getElementById('Results').innerHTML = output.join('');
                });
            }
        }
    }

    myWorker.postMessage({"func": "ReadFiles", "files": files});
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