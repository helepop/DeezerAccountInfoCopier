self.addEventListener('message',function(e){
    //initDeezerAPI();
    var func = e.data.func;
    switch (func) {
        case "ReadFiles":
            var files = e.data.files;
            var buffers = [];

            // Read each file synchronously as an ArrayBuffer and
            // stash it in a global array to return to the main app.
            [].forEach.call(files, function (file) {
                var reader = new FileReaderSync();
                var res = reader.readAsBinaryString(file);
                var content = JSON.parse(res);
                buffers.push({
                    filename: file.name,
                    content: content
                });
            });

            postMessage(buffers);
            break;

        case "geTargetPlayList":
            var TargetPLayLists;
            var apiCall = e.data.apiCall;

            DZ.api(apiCall + "?limit=100", function (PlayListResponse, TargetPLayLists) {
                TargetPLayLists = PlayListResponse.Data
                //TargetPLayLists.filter()
            })
            postMessage(TargetPLayLists)
        default:
            break;
    }

}, false);