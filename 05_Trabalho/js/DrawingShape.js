function DrawingShape(x,y,color,cnvs)
{
    this.x = x;
    this.y = y;
    this.color = color;
    this.cnvs = cnvs;
    this.ctx = this.cnvs.getContext("2d");

    this.draw = function() {
    };

    this.overcheck = function (mx,my) {
        if((mx>=this.x)&&(mx<=(this.x+this.w))&&(my>=this.y)&&(my<=(this.y+this.h))) {
            return true;
        }
        return false;
    };

    this.distsq = function (x1,y1,x2,y2) {
        var xd = x1 - x2;
        var yd = y1 - y2;
        return ((xd*xd) + (yd*yd) );
    };
}


function Rect(x,y,w,h,c,cnvs) {
    this.w = w;
    this.h = h;

    DrawingShape.call(this,x,y,c,cnvs);

    this.draw = function () {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    };
}

Rect.prototype = Object.create(DrawingShape.prototype);
Rect.prototype.constructor = Rect;


function Picture(x,y,w,h,imagename,cnvs) {
    this.w = w;
    this.h = h;
    this.imagename = imagename;

    DrawingShape.call(this,x,y,"white",cnvs);

    this.draw = function() {
        this.ctx.drawImage(this.imagename,this.x,this.y,this.w,this.h);
    };
}

Picture.prototype = Object.create(DrawingShape.prototype);
Picture.prototype.constructor = Picture;


function Oval(x,y,r,hor,ver,c,cnvs) {
    this.r = r;
    this.radsq = r*r;
    this.hor = hor;
    this.ver = ver;

    DrawingShape.call(this,x,y,c,cnvs);

    this.overcheck = function overoval(mx,my) {
        var x1 = 0;
        var y1 = 0;
        var x2 = (mx-this.x)/this.hor;
        var y2 = (my-this.y)/this.ver;
        if (this.distsq(x1,y1,x2,y2)<=(this.radsq) ){
            return true;
        }
        return false;
    };

    this.draw = function() {
        this.ctx.save();
        this.ctx.translate(this.x,this.y);
        this.ctx.scale(this.hor,this.ver);
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(0,0,this.r,0,2*Math.PI,true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    };
}
Oval.prototype = Object.create(DrawingShape.prototype);
Oval.prototype.constructor = Oval;


function Heart(x,y,h,drx,color,cnvs) {
    this.h = h;
    this.drx = drx;
    this.radsq = drx*drx;
    this.ang = .25*Math.PI;

    DrawingShape.call(this,x,y,color,cnvs);

    var outside = function (x,y,w,h,mx,my) {
        return ((mx<x) || (mx > (x+w)) || (my < y) || (my > (y+h)));
    };

    this.draw = function() {
        var leftctrx = this.x-this.drx;
        var rightctrx = this.x+this.drx;
        var cx = rightctrx+this.drx*Math.cos(this.ang);
        var cy = this.y + this.drx*Math.sin(this.ang);
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x,this.y);
        this.ctx.arc(leftctrx,this.y,this.drx,0,Math.PI-this.ang,true);
        this.ctx.lineTo(this.x,this.y+this.h);
        this.ctx.lineTo(cx,cy);
        this.ctx.arc(rightctrx,this.y,this.drx,this.ang,Math.PI,true);
        this.ctx.closePath();
        this.ctx.fill();
    };

    this.overcheck = function (mx,my) {
        var leftctrx = this.x-this.drx;
        var rightctrx = this.x+this.drx;
        var qx = this.x-2*this.drx;
        var qy = this.y-this.drx;
        var qwidth = 4*this.drx;
        var qheight = this.drx+this.h;

        //quick test if it is in bounding rectangle
        if (outside(qx,qy,qwidth,qheight,mx,my)) {
            return false;
        }

        //compare to two centers
        if (this.distsq(mx,my,leftctrx,this.y)<this.radsq) return true;
        if (this.distsq(mx,my,rightctrx,this.y)<this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my<=this.y) return false;

        // compare to each slope
        var x2 = this.x
        var y2 = this.y + this.h;
        var m = (this.h)/(2*this.drx);

        // left side
        if (mx<=this.x) {
            if (my < (m*(mx-x2)+y2)) {
                return true;
            }
            return false;
        } else {  //right side
            m = -m;
            if (my < (m*(mx-x2)+y2)) {
                return true;
            }
            return false;
        }
    };
}
Heart.prototype = Object.create(DrawingShape.prototype);
Heart.prototype.constructor = Heart;

function getSymmetry(coord, size) {
  return coord + size / 2;
}

function Bear(x, y, width, height, color, canvas) {
  var xS = getSymmetry(x, width);
  var yS = getSymmetry(x, height);
  console.log(x + width/2);
  console.log("%d, %d, %d, %d", x, y, xS, yS);
  var square = new Rect(x, y, width, height, color, canvas);
  var face = new Oval(x + xS, y + yS, width/2, 0.75, 0.75, "white", canvas);
  var lEye = new Oval((x + width)/2-15, y + width/2, width/4, 0.25, 0.25, "black", canvas);
  var rEye = new Oval((x + width)/2+15, y + width/2, width/4, 0.25, 0.25, "black", canvas);
  var iReye;
  var iLeye;
  var lEar;
  var rEar;
  var iLear;
  var iRear;
  var nose;
  var iNose;
  var lMouth;
  var rMouth;


  this.draw = function() {
    square.draw();
    face.draw();
    lEye.draw();
    rEye.draw();
  };
}

Bear.prototype = Object.create(DrawingShape.prototype);
Bear.prototype.constructor = Bear;

function Monster(x, y, width, height, color, canvas) {
  var xS = getSymmetry(x, width);
  var yS = getSymmetry(y, height);

  var radius = 4;

  var square = new Rect(x, y, width, height, color, canvas);
  var lEye = new Oval(xS - width / 4, yS - height / 8, 10, 1, 1, "white", canvas);
  var rEye = new Oval(xS + width / 4, yS - height / 8, 10, 1, 1, "white", canvas);
  var iReye = new Oval(xS - width / 3.5, yS - height / 10, radius, 1, 1, color, canvas);
  var iLeye = new Oval(xS + width / 3.5 - radius*2, yS - height / 10, radius, 1, 1, color, canvas);
  // TODO: Head arc
  // var lHead = new Arc(x + height / 4, yS - height / 4, 20, 180, 270, false, "red", "red", canvas);
  // var rHead = new Arc();
  var pointer = new Rect(x + height / 4, yS - height / 4, 3, 3, "red", canvas);

  this.draw = function() {
    square.draw();
    lEye.draw();
    rEye.draw();
    iReye.draw();
    iLeye.draw();
    lHead.draw();
    rHead.draw();

    pointer.draw();
  }
}

Monster.prototype = Object.create(DrawingShape.prototype);
Monster.prototype.constructor = Monster;


function Arc(xPos, yPos, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor, cnvs) {
    var startAngle = startAngle * (Math.PI/180);
    var endAngle = endAngle * (Math.PI/180);
    var radius = radius;

    DrawingShape.call(this,xPos,yPos,fillColor,cnvs);

    this.draw = function() {
      this.ctx.strokeStyle = lineColor;
      this.ctx.fillStyle = fillColor;
      this.ctx.lineWidth = 1;

      this.ctx.beginPath();
      this.ctx.arc(xPos, yPos, radius, startAngle, endAngle, anticlockwise);
      this.ctx.fill();
      this.ctx.stroke();
    }
}

Arc.prototype = Object.create(DrawingShape.prototype);
Arc.prototype.constructor = Arc;

function Face(x, y, width, height, color, canvas) {
  // draw left arc
  // draw right arc
  // draw left eye
  // draw right eye
  // draw mouth
  // draw flower - draw one side of the flower and replicate in a circle
  this.draw = function() {

  }
}
