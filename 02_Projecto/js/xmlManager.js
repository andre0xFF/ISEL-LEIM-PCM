function XML_Data(file) {
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
	};
    
    this.keyWordSearchXML = function (query) {
		var xmlDoc = this.loadXML();
		var x = xmlDoc.getElementsByTagName("image");
        var counter = 0;

        var imagesArray = [];  
        
        var keyWords = query.split(" ");
        
		for (var i = 0; i < x.length; i++) {
            var path = x[i].getElementsByTagName("path")[0].childNodes[0].nodeValue;
            var category = x[i].className;
            var id = x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
            
            //A base de dados não tem descricao pra nenhuma imagem
            //var description = x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
            
            //A base de dados não tem um titulo para todas as imagens
            var title = x[i].getElementsByTagName("title");
            if (title[0].childNodes.length > 0) title = title[0].childNodes[0].nodeValue;
            else title = null;
            
            var match = false;
            
            for(var j = 0; j < keyWords.length; ++j) {
                var key = keyWords[j].toLowerCase();
                if(id.toLowerCase().indexOf(key) > -1 || category.toLowerCase().indexOf(key) > -1 || title != null && title.toLowerCase().indexOf(key) > -1) {
                    match = true; 
                    break;
                }
            }
            
            var img = new Image();
            img.onload = function() { 
                count();            
            };
            img.src = path;
            
            if(match) imagesArray.push(img);
                            
            function count() {
                counter++;
                if (counter === x.length-1) {
                    displayImages(imagesArray);
                }
            }
        }               
	};
    
    this.dominantColorSearchXML = function (color) {
		var localStorageRow = localStorage.getItem("hist12XML");

		if (window.DOMParser) {
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(localStorageRow, "text/xml");
		}
        
		var x = xmlDoc.getElementsByTagName("image");
        var paths = [];
        
        for (var i = 0; i < x.length; ++i) {
            if(x[i].className === color) {
                paths = x[i].getElementsByTagName("path");
                break;
            }
        }
        
        var imagesArray = [];
        var counter = 0;
        
		for (var i = 0; i < paths.length; i++) {
            var img = new Image();
            imagesArray.push(img);
            img.onload = function() { 
                count();
            };
            img.src = paths[i].innerHTML;
            
            function count() {
                counter++;
                if (counter === paths.length-1) {
                    displayImages(imagesArray);
                }
            }   
		}

	};
    
    this.similarImageSearch = function (url) {
		
        var imagesArray = [];
        var localStorageRow = localStorage.getItem(url);
                
		if(localStorageRow == null) return displayImages(imagesArray);
				
        if (window.DOMParser) {
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(localStorageRow, "text/xml");
		}
        
        var paths = xmlDoc.getElementsByTagName("path");
        
        var counter = 0;
        
		for (var i = 0; i < paths.length; i++) {
            var img = new Image();
            imagesArray.push(img);
            img.onload = function() { 
                count();
            };
            img.src = paths[i].innerHTML;
            
            function count() {
                counter++;
                if (counter === paths.length-1) {
                    displayImages(imagesArray);
                }
            }   
		}
        
    }
    
}


	
	
	
    







    
    
   