"use strict";

var accessToken;

function Start(files) {
    console.log("files: " + files);
    for (var j = 0, file; file = files[j]; j++) {
        console.log(file);
        var fr = new FileReader();
        fr.onloadend = function (event) {
            var res = event.target.result;
            var content = JSON.parse(res);
            copyContent(content);
        };
        fr.readAsBinaryString(file);
    }
}

function copyContent(content) {
    for (var j = 0, data; data = content.data[j]; j++) {
        if (content.data.type != 'playlist') {
            var apiCall = 'user/1240636962/' + data.type + 's';
            console.log('apiCall: ' + apiCall + data.type + ": " + data.id + " " + data.title);
            //DZ.api(apiCall, 'POST', { album_id: data.id }, function (response) {
            //    if (response.error) {
            //        var error = response.error;
            //        console.log(error.message);
            //    } else {
            //        console.log(1 + "." + "id: " + response.id + " - " + response.title);
            //    }

            //});
        }
    }
}

function HandleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    Start(files);
}

function Init() {
    document.getElementById('files').addEventListener('change', HandleFileSelect, false);

    DZ.init({
        appId: '214962',
        channelUrl: 'http://localhost/DeezerAccountInfoCopier/App/channel.html'
    });
    document.getElementById('dz-init').innerHTML = 'DZ.SDK initialized';

    //Check if User is logged in
    DZ.getLoginStatus(function (response) {
        if (response.authResponse) {
            console.log("logged in and connected user, someone you know");
            accessToken = response.authResponse.accessToken;
        } else {
            console.log("no user session available, someone you dont know");
            Login();
        }
    });

    getOwnInformtions();
}

function Login() {
    DZ.login(function (response) {
        if (response.authResponse) {
            DZ.api('/user/me', function (response) {
                alert('Good to see you, ' + response.name + '.');
            });
            accessToken = response.authResponse.accessToken;
            userid = userID;
        } else {
            alert('User cancelled login or did not fully authorize.');
        }
    }, { perms: 'manage_community,manage_library,basic_access,email' });
}

function getOwnInformtions(userID) {
    var res; 
    if (userID != "") {
        DZ.api('/user/' + userID, function (response) {
            res = response;
            console.log("My name", response.name);
        });
    } else {
        DZ.api('/user/me', function (response) {
            res = response;
            console.log("My name", response.name);
        });
    }
    return res;
}