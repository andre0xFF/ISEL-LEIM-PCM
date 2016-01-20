function process () {
    var xml_d = new XML_Data("xml/my_database1.xml");
    var imagesArray = xml_d.readXML();
}

function InfoImage(url) {
    
    var img = new Image();
    img.src = url;
    var count_pixel_color = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var c_moments;
    
    this.getName = function () {
        return name;
    };
    
    this.getURL = function () {
        return img.src.slice(img.src.lastIndexOf("Images"));
    };
    
    this.getColorMoments = function () {
        return c_moments;
    };
    
    this.setColorMoments = function (moments) {
        c_moments = moments;
    }
    
    this.getCountPixelColor = function () {
        return count_pixel_color;
    };
    
    this.setCountPixelColor = function (count) {
        count_pixel_color = count;
    };
}

function XML_Data(file) {
    
    this.images = [];
    
	this.filename = file;
    
	this.init = function () {
		this.readXML();
	};
    
	this.loadXML = function () {
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		}
		xmlhttp.open("GET", this.filename, false);
		xmlhttp.send();
		var xmlDoc = xmlhttp.responseXML;
		return xmlDoc;
	}

	this.readXML = function () {
		var xmlDoc = this.loadXML();
		var x = xmlDoc.getElementsByTagName("image");
        var counter = 0;

        //Array todas as imagens
        var imagesArray = [];  
        
		for (i = 0; i < x.length; i++) {
            var path = x[i].getElementsByTagName("path")[0].childNodes[0].nodeValue;
            var name = path.substring(path.lastIndexOf("/") + 1, path.length);
             
            function count() {
                counter++;
                if (counter === x.length-1) {
                    processImages(imagesArray);
                }
            }
            
            //Criar a imagem e adicionar ao array
            var img = new Image();
            img.onload = function() { count() };
            img.src = path;
            imagesArray.push(img);
        }               
	}
}

function processImages(imagesArray) {
    saveHistogramaXML(imageProcessColorHist(imagesArray));
    console.log("Histogram process complete");
    saveMomentosXML(imageProcessColorMoments(imagesArray));
    console.log("Moments process complete");
}

function saveHistogramaXML(infoImages) {
    //infoImages = array[12][25]
    //Para as 12 cores as 25 imagens com mais cor correspondente
    var xmlString = "<images>";

    var cores = ["Amarelo","Azul","Branco","Castanho","Cinzento","Laranja","Preto","Rosa","Roxo","Verde","Verde-Azulado", "Vermelho"];

    for(var i = 0; i < cores.length; ++i) {
        xmlString += "<image class='"+cores[i]+"'>";
        //Array com as imagens
        for(var j = 0; j < infoImages[i].length; ++j) {
            var path = infoImages[i][j].getURL();
            path = path.slice(path.lastIndexOf("Images"));
            xmlString += "<path>"+path+"</path>";
        }
        xmlString += "</image>";
    }
    
    xmlString += "</images>";
    
    if (typeof(localStorage) == 'undefined')
        alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    else {
        try {
            localStorage.setItem("hist12XML", xmlString);
        }
        catch (e) {
            alert("save failed!");
            if (e == QUOTA_EXCEEDED_ERR)
                alert('Quota exceeded!');
        }
    }
}

function saveMomentosXML(infoImages) {  
    for (var path in infoImages) {
        var xmlString = "<images>";
        if(infoImages.hasOwnProperty(path) ) {
            for(var i = 0; i < infoImages[path].length; ++i) {
                xmlString += "<image class='Manhattan'>";
                xmlString += "<path>"+infoImages[path][i]+"</path>";
                xmlString += "</image>";
            }
             xmlString += "</images>";
        }
   
        if (typeof(localStorage) == 'undefined')
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        else {
            try {
                localStorage.setItem(path, xmlString);
            }
            catch (e) {
                alert("save failed!");
                if (e == QUOTA_EXCEEDED_ERR)
                    alert('Quota exceeded!');
            }
        }
    }
}
	