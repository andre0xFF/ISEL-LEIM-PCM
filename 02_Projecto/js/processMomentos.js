function MomentosCor(canvas) {
    this.canvas = canvas;
    var h_blocos = 3;    // número de blocos horizontais
    var v_blocos = 3;    // número de blocos verticais
    var num_stat = 2;    // media e variância
    var color_comp = 3   // RGB or HSV
    var features = h_blocos* v_blocos * num_stat * color_comp; // dimensão do descritor

    // método privado que inicializa a 0 todos os valores do array descritor
    var init_descritor = function (descritor) {
        for (var i = 0; i < features; i++) {
            descritor[i] = 0;
        }
    };
    
    // método que divide cada componente (HSV) da imagem em 9 blocos e calcula a média e a variância do valor pixels
    this.compute_momentos_cor = function (img) {

        //Inicializações do método
        // Array para guardar os valores calculados
        var descritor = new Array(features);

        //número de colunas do bloco
        var wBloco = Math.floor(img.width / h_blocos);

        //número de linhas do bloo
        var hBloco = Math.floor(img.height / v_blocos);

        // desenhar da imagem no canvas
        var ctx = this.canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0,img.width,img.height);

        // inicialização do descritor a 0
        init_descritor(descritor);

        //organização vector descritor
        //              1º bloco        
        //(med_h,var_h,med_s,var_s,med_v,var_v)
        
        var n = 0;
        
        for(var l = 0; l < v_blocos; ++l) {
            for(var c = 0; c < h_blocos; ++c) {
                var imgdata = ctx.getImageData(c*wBloco,l*hBloco,wBloco,hBloco);
                
                var mediaBloco = calcMed(imgdata);
                descritor[n++] = mediaBloco[0];
                descritor[n++] = mediaBloco[1];
                descritor[n++] = mediaBloco[2];
                
                var varBloco = calcVar(imgdata,mediaBloco);
                descritor[n++] = varBloco[0];
                descritor[n++] = varBloco[1];
                descritor[n++] = varBloco[2];
            }
        }
        
        // Código para ser implementado pelos alunos
        // dois ciclos para processar os blocos horizontais e verticais individualmente
            // Copiar do canvas os pixels para uma variável do tipo ImageData
            // Fazer inicializações de variáveis necessárias para o cálculo das médias e das variâncias
            // um ciclo para calcular as médias
            // um ciclo para calcular as variâncias

        
        
        return descritor;
    };
    
}

// método privado que converte as coordenadas rgb de um pixel em coordenadas hsv
var rgbToHsv = function (rc, gc, bc) {
    var r = rc / 255;
    var g = gc / 255;
    var b = bc / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, v = max;

    var dif = max - min;
    s = max == 0 ? 0 : dif / max;

    if (max == min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / dif + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / dif + 2;
                break;
            case b:
                h = (r - g) / dif + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, v];
};


// função que calcula distância de Manhattan entre dois vetores/descritores
function Manhattan_distance(vDesc1, vDesc2) {
    var manhattan = 0;

    for (var i = 0; i < vDesc1.length; i++) {
        manhattan += Math.abs(vDesc1[i] - vDesc2[i]);
    }
    manhattan /= 54;
    return manhattan;
}

function calcMed(imgData) {

    var h = 0;
    var s = 0;
    var v = 0;
    var n = imgData.data.length/4;

    for (var i = 0; i < imgData.data.length; i += 4) {
        var hsv = rgbToHsv(imgData.data[i + 0],imgData.data[i + 1],imgData.data[i + 2]);
        h += hsv[0];
        s += hsv[1];
        v += hsv[2];
    }

    return [h/n,s/n,v/n];
}

function calcVar(imgData, mediaBloco) {

    var h = 0;
    var s = 0;
    var v = 0;
    var n = imgData.data.length/4;

    for (var i = 0; i < imgData.data.length; i += 4) {
        var hsv = rgbToHsv(imgData.data[i + 0],imgData.data[i + 1],imgData.data[i + 2]);
        h += Math.pow(hsv[0]-mediaBloco[0],2);
        s += Math.pow(hsv[1]-mediaBloco[1],1);
        v += Math.pow(hsv[2]-mediaBloco[2],2);
    }

    return [h/(n-1),s/(n-1),v/(n-1)];
}

function imageProcessColorMoments(imagesArray) {
    var infoImagesArray = [];

    var canvas = document.querySelector("canvas"); 
    var ctx = canvas.getContext("2d");

    var mc = new MomentosCor(canvas);

    //Calcular vector descritor para cada uma das imagens da base de dados
    for(var i = 0; i < imagesArray.length; ++i) {
        var infoImg = new InfoImage(imagesArray[i].src);
        infoImg.setColorMoments(mc.compute_momentos_cor(imagesArray[i]));
        infoImagesArray.push(infoImg);
    }
    
    //Estrutura:
    //"path da imagem":"path das imagens semelhantes[20] 
    var infoImages = {};
    
    for(var i = 0; i < infoImagesArray.length; ++i) {
        var path = infoImagesArray[i].getURL();
        if(!infoImages.hasOwnProperty(path))  {
            infoImages[path] = [];
        }      
        
        //Copiar o array com todas as imagens
        var similar = infoImagesArray.slice();
        //Tirar a própria
        similar.splice(i,1);
        //Ordenar decrescentemente pela distancia de manhattan relativamente á imagem original
        similar.sort(function(a, b) {
            return Manhattan_distance(infoImagesArray[i].getColorMoments(),a.getColorMoments()) - 
                   Manhattan_distance(infoImagesArray[i].getColorMoments(),b.getColorMoments());
        });
        //Truncar o array
        similar = similar.slice(0,20);
        //Aproveitar só o URL de cada imagem
        for(var j = 0; j < similar.length; ++j) {
            similar[j] = similar[j].getURL();
        }
        infoImages[path] = similar;
    }
    
    return infoImages;
    
}
