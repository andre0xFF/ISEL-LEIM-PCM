var app = new FotoPrint();

function FotoPrint()
{
    this.aImg = new AppImages();
    this.thingInMotion = null;
    this.offsetx = null;
    this.offsetx = null;

    this.init = function() {
        this.shpinDrawing = new Pool(100);
        this.canvas1 = document.getElementById('canvas');
        this.ctx = this.canvas1.getContext("2d");

        this.drawCanvasRect();

        var r1 = new Rect(2, 10, 50, 50,"red",this.canvas1);
        var s1 = new Rect(60, 10, 50, 50, "green", this.canvas1);
        var oval1 = new Oval(200, 30, 20, 2.0, 1.0, "teal",this.canvas1);
        var cir1 = new Oval(300, 30, 20, 1.0, 1.0, "purple",this.canvas1);
        var pic1 = new Picture(10, 100, 100, 100, this.aImg.dad, this.canvas1);
        var pic2 = new Picture(120, 100, 100, 100, this.aImg.mom, this.canvas1);
        var pic3 = new Picture(230, 100, 100, 100, this.aImg.son1, this.canvas1);
        var pic4 = new Picture(340, 100, 100, 100, this.aImg.son2, this.canvas1);
        var pic5 = new Picture(450, 100, 100, 100, this.aImg.daughter,this.canvas1);
        var hrt = new Heart(510, 30, 60, 20, "pink", this.canvas1);
        var monster = new Monster(10, 250, 100, 100, "black", this.canvas1);

        this.insertObj(pic1);
        this.insertObj(pic2);
        this.insertObj(pic3);
        this.insertObj(pic4);
        this.insertObj(pic5);
        this.insertObj(r1);
        this.insertObj(s1);
        this.insertObj(oval1);
        this.insertObj(cir1);
        this.insertObj(hrt);
        this.insertObj(monster);

        this.canvas1.addEventListener('mousedown', drag, false);
        this.canvas1.addEventListener('dblclick', makenewitem, false);
    };

    this.drawCanvasRect = function() {
        this.ctx.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas1.width, this.canvas1.height);
    };

    this.drawshapes= function() {
        this.drawCanvasRect();
        for (var i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw();
        }
    };

    this.removeObj = function() {
        this.shpinDrawing.removeObj();
        this.drawshapes();
    };

    this.insertObj = function(obj) {
        this.shpinDrawing.insertObj(obj);
        obj.draw();
    };

    this.clone = function (obj) {
        var item = new Object();
        for (var info in obj) {
            item[info] = obj[info];
        }
        return item;
    };
}

function AppImages() {
    this.dad = new Image();
    this.mom = new Image();
    this.son1 = new Image();
    this.son2 = new Image();
    this.daughter = new Image();

    var numImages = 5;
    var numLoaded = 0;

    function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
            app.init();
        }
    }

    this.dad.onload = function () {
        imageLoaded();
    };

    this.mom.onload = function () {
        imageLoaded();
    };
    this.son1.onload = function () {
        imageLoaded();
    };
    this.son2.onload = function () {
        imageLoaded();
    };
    this.daughter.onload = function () {
        imageLoaded();
    };
    this.dad.src = "imgs/daniel1.jpg";
    this.mom.src = "imgs/allison1.jpg";
    this.son1.src = "imgs/grant1.jpg";
    this.son2.src = "imgs/liam2.jpg";
    this.daughter.src = "imgs/annika.jpg";
}

function Pool(maxSize) {
    var size = maxSize;
    this.stuff = [];

    this.insertObj = function(obj) {
        this.stuff.push(obj);
    };

    this.removeObj = function() {
        this.stuff.pop();
    };
}


//Drag & Drop
function drag(ev) {
    var mx;
    var my;
    if ( ev.layerX ||  ev.layerX == 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    var endpt = app.shpinDrawing.stuff.length-1;
    for (var i=endpt;i>=0;i--) {
        if (app.shpinDrawing.stuff[i].overcheck(mx,my)) {
            app.offsetx = mx-app.shpinDrawing.stuff[i].x;
            app.offsety = my-app.shpinDrawing.stuff[i].y;
            var item = app.shpinDrawing.stuff[i];
            app.thingInMotion = app.shpinDrawing.stuff.length-1;
            app.shpinDrawing.stuff.splice(i,1);
            app.shpinDrawing.stuff.push(item);
            app.canvas1.style.cursor = "pointer";   // change to finger when dragging
            app.canvas1.addEventListener('mousemove',move,false);
            app.canvas1.addEventListener('mouseup',drop,false);
            break;
        }
    }
}

function move(ev) {
    var mx;
    var my;
    if ( ev.layerX ||  ev.layerX == 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    app.shpinDrawing.stuff[app.thingInMotion].x = mx-app.offsetx; //adjust for flypaper dragging
    app.shpinDrawing.stuff[app.thingInMotion].y = my-app.offsety;
    app.drawshapes();
}

function drop(ev) {
    app.canvas1.removeEventListener('mousemove',move,false);
    app.canvas1.removeEventListener('mouseup',drop,false);
    app.canvas1.style.cursor = "crosshair";
}

//Resposta ao evento doubleClick
function makenewitem(ev) {
    var mx;
    var my;
    if ( ev.layerX ||  ev.layerX == 0) {
        mx= ev.layerX;
        my = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    var endpt = app.shpinDrawing.stuff.length-1;
    var item;
    for (var i=endpt;i>=0;i--) {  //reverse order
        if (app.shpinDrawing.stuff[i].overcheck(mx,my)) {
            item = app.clone(app.shpinDrawing.stuff[i]);
            item.x +=20;
            item.y += 20;
            app.insertObj(item);
            break;
        }
    }
}

//Resposta ao evento onclick no botão
function removeobj() {
    app.removeObj();
}

//Resposta ao evento onclick no botão
function saveasimage() {
    try {
        window.open(app.canvas1.toDataURL("imgs/png"));}
    catch(err) {
        alert("You need to change browsers OR upload the file to a server.");
    }
}
