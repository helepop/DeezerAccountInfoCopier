var AlbumsContent = ""
var Albums

function start(file){
    console.log(file);
    var fr = new FileReader();
    var AlbumsJSONLoaded = function(event){
        var res = event.target.result;
        AlbumsContent = fr.result;
        console.log(AlbumsContent);
        Albums = JSON.parse(AlbumsContent);
    }
    fr.onloadend = AlbumsJSONLoaded;
    
    fr.readAsBinaryString(file);     
}

