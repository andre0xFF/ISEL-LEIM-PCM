function Hist12cores(imgdata){
    this.num_pixel_Color = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    this.count_Pixels = function () {
        for (var i = 0; i < imgdata.data.length; i += 4) {
            var r = imgdata.data[i + 0];
            var g = imgdata.data[i + 1];
            var b = imgdata.data[i + 2];
            // amarelo (valores --> RGB 255 255 0)
            if (r == 255 && g == 255 && b == 0) this.num_pixel_Color[0] += 1;
            // azul (valores --> RGB 0 0 255)
            else if (r == 0 && g == 0 && b == 255) this.num_pixel_Color[1] += 1;
            // branco (valores --> RGB 255 255 255)
            else if (r == 255 && g == 255 && b == 255) this.num_pixel_Color[2] += 1;
            // castanho (valores --> RGB 136 84 24)
            else if (r == 136 && g == 84 && b == 24) this.num_pixel_Color[3] += 1;
            // cinzento (valores --> RGB 153 153 153)
            else if (r == 153 && g == 153 && b == 153) this.num_pixel_Color[4] += 1;
            // laranja (valores --> RGB 251 148 11).
            else if (r == 251 && g == 148 && b == 11) this.num_pixel_Color[5] += 1;
            // preto (valores --> RGB 0 0 0)
            else if (r == 0 && g == 0 && b == 0) this.num_pixel_Color[6] += 1;  
            // rosa (valores --> RGB 255 152 191).
            else if (r == 255 && g == 152 && b == 191) this.num_pixel_Color[7] += 1;    
            // roxo (valores --> RGB 118 44 167)
            else if (r == 118 && g == 44 && b == 167) this.num_pixel_Color[8] += 1;
            // verde (valores --> RGB 0 204 0)
            else if (r == 0 && g == 204 && b == 0) this.num_pixel_Color[9] += 1;
            // verde-azulado (valores --> RGB 3 192 198)
            else if (r == 3 && g == 192 && b == 198) this.num_pixel_Color[10] += 1; 
            // vermelho (valores --> RGB 204 0 0)
            else if(r == 204 && g == 0 && b == 0)  this.num_pixel_Color[11] += 1;
        }
    };

    this.get_num_pixel_Color = function () {
        return this.num_pixel_Color;
    };

    this.build_Color_Rect = function (canvas) {
        var width = canvas.width/num_pixel_Color.length;
        var ctx = canvas.getContext("2d");
        var imgData = ctx.createImageData(canvas.width,canvas.height);
    };
}

//Processar o histograma de todas as imagens e ordenar por cor
function imageProcessColorHist(imagesArray) {
    
    var infoImages = [];
    
    var canvas = document.querySelector("canvas"); 
    var ctx = canvas.getContext("2d");
    
    //Criar objecto InfoImage para cada imagem no array passado como parâmetro
    //para calcular o histograma de 12 cores para todas as imagens
    for(var i = 0; i < imagesArray.length; ++i) {
        
        var img = imagesArray[i];
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0,img.width,img.height);

        var hist = new Hist12cores(ctx.getImageData(0,0,img.width,img.height));
        hist.count_Pixels();

        var info = new InfoImage(img.src);
        info.setCountPixelColor(hist.get_num_pixel_Color());
       
        infoImages.push(info);
    }
    
     //[12][25]
    //Para cada uma das 12 cores as 25 imagens com mais pixeis dessa cor
    var infoImagesSorted = [];
    
    for(var i = 0; i < 12; ++i) {
        var temp = infoImages.slice();
        temp.sort(function(a, b) {return b.getCountPixelColor()[i] - a.getCountPixelColor()[i]});
        infoImagesSorted.push(temp.slice(0,25));
    }
    
    return infoImagesSorted;
}