//audio
var hoverSound = new Audio('sounds/switch14.mp3');
var searchSound = new Audio('sounds/switch17.mp3');
var changePageSound = new Audio('sounds/page-flip-02.mp3');

var xml_d;
var canvas;
var ctx;

window.onload = function() {
    xml_d = new XML_Data("xml/my_database1.xml");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
}

var imgsPerRow = 10;
var displayMargin = 20;
var displaySize = 100;

var lastColorDiv = null;

function dominantColorSearch(div) {
    if(lastColorDiv != null) lastColorDiv.className = "";
    div.className = "selected";
    lastColorDiv = div;
    searchSound.play();
    xml_d.dominantColorSearchXML(div.id);
}

function keyWordSearch() {
    var query = document.getElementById('search').value;
    searchSound.play();
    xml_d.keyWordSearchXML(query);
}

function similarImageSearch() {
    var url = document.getElementById('search').value;
    searchSound.play();
    xml_d.similarImageSearch(url)
}

function displayImages(imagesArray) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(imagesArray.length > 0) {
        var currentX = 0;
        var currentY = 0;

        var rows = Math.ceil(imagesArray.length/imgsPerRow);
        
        canvas.height = rows*displaySize + (rows-1)*displayMargin;
        
        for(var i = 0; i < imagesArray.length; ++i) {
            if(i != 0 && i%imgsPerRow == 0) {
                currentY += displaySize+displayMargin;
                currentX = 0;
            }
            var img = imagesArray[i];
            ctx.drawImage(img,currentX,currentY,displaySize,displaySize);
            currentX += displaySize+displayMargin;
        }
        
        var delta = Math.floor(canvas.height*0.05);
        var currentY = -canvas.height;
        var currentA = 0;
        var canvasData = ctx.getImageData(0,0,canvas.width,canvas.height);
        ctx.clearRect(0,0,canvas.width,canvas.height)
        window.requestAnimationFrame(drawFrame);
        
    } else {
        canvas.height = displaySize;
        ctx.textAlign="center";
        ctx.fillText("Sem resultados",canvas.width/2,canvas.height/2); 
    }
    
    function drawFrame() {
        console.log(canvas.height + ";" + currentA);
        if(currentY == 0 && currentA >= 255) {
            currentY = 0;
            ctx.translate(0,currentY);
            ctx.putImageData(canvasData,0,currentY);
        }
        else {
            ctx.clearRect(0,0,canvas.width,canvas.height)
            
            currentA += 10;
            if(currentY >= 0) currentY = 0;
            else {
                currentY += delta;
                ctx.translate(0,currentY);
            }

            //Canvas é black opacity rect
            for(var i = 0; i < canvasData.data.length; i += 4) canvasData.data[i+3] = canvasData.data[i+3] == 0 ? 0 : currentA;
            ctx.putImageData(canvasData,0,currentY);
            window.requestAnimationFrame(drawFrame);
        }
    }
    
}

