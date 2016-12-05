self.addEventListener('message', function(e) {
  var files = e.data;
  var buffers = [];

  // Read each file synchronously as an ArrayBuffer and
  // stash it in a global array to return to the main app.
  [].forEach.call(files, function(file) {
    var reader = new FileReaderSync();
    var res = reader.readAsBinaryString(file);
    var content = JSON.parse(res);  
    buffers.push({
        filename: file.name,
        content: content    
    });
  });

  postMessage(buffers);
}, false);