class DrawingObjects
{
  constructor(px, py, name) {
    if (this.constructor === DrawingObjects) {
      // Error Type 1. Abstract class can not be constructed.
      throw new TypeError("Can not construct abstract class.");
    }

    //else (called from child)
    // Check if all instance methods are implemented.
    if (this.draw === DrawingObjects.prototype.draw) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError("Please implement abstract method draw.");
    }

    if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError("Please implement abstract method mouseOver.");
    }

    this.posx = px;
    this.posy = py;
    this.name = name;
  }

  draw(cnv) {
    // Error Type 6. The child has implemented this method but also called `super.foo()`.
    throw new TypeError("Do not call abstract method draw from child.");
  }

  mouseOver(mx, my) {
    // Error Type 6. The child has implemented this method but also called `super.foo()`.
    throw new TypeError("Do not call abstract method mouseOver from child.");
  }

  sqDist(px1, py1, px2, py2) {
    let xd = px1 - px2;
    let yd = py1 - py2;

    return ((xd * xd) + (yd * yd));
  }
}

class Rect extends DrawingObjects
{
  // px - x position
  // py - y position
  // w - width
  // h - height
  // c - color
  constructor(px, py, w, h, c) {
    super(px, py, 'R');
    this.w = w;
    this.h = h;
    this.color = c;
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.fillStyle = this.color;
    ctx.fillRect(this.posx, this.posy, this.w, this.h);

  }

  mouseOver(mx, my) {
    if ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h))) {
      return true;
    }
    return false;
  }

}

class Picture extends DrawingObjects
{
  // px - x position
  // py - y position
  // w - width
  // h - height
  // impath - image path
  constructor(px, py, w, h, impath) {
    super(px, py, 'P');
    this.w = w;
    this.h = h;
    this.impath = impath;
    this.imgobj = new Image();
    this.imgobj.src = this.impath;
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    if (this.imgobj.complete) {
      ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
      console.log("Debug: N Time");

    } else {
      console.log("Debug: First Time");
      let self = this;
      this.imgobj.addEventListener('load', function () {
        ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
      }, false);
    }
  }

  mouseOver(mx, my) {
    if ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h))) {
      return true;
    }
    return false;
  }
}

class Oval extends DrawingObjects
{
  // px - x position
  // py - y position
  // r - radius
  // hs - horizontal scale
  // vs - vertical scale
  // c - color
  constructor(px, py, r, hs, vs, c) {
    super(px, py, 'O');
    this.r = r;
    this.radsq = r * r;
    this.hor = hs;
    this.ver = vs;
    this.color = c;
  }

  mouseOver(mx, my) {
    let x1 = 0;
    let y1 = 0;
    let x2 = (mx - this.posx) / this.hor;
    let y2 = (my - this.posy) / this.ver;

    if (this.sqDist(x1, y1, x2, y2) <= (this.radsq)) {
      return true;
    }
    return false;
  }

  draw(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.save();
    ctx.translate(this.posx, this.posy);
    ctx.scale(this.hor, this.ver);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

class Heart extends DrawingObjects
{
  constructor(px, py, h, drx, c) {
    super(px, py, 'H');
    this.h = h;
    this.drx = drx;
    this.radsq = drx * drx;
    this.ang = .25 * Math.PI;
    this.color = c;
  }

  outside(x, y, w, h, mx, my) {
    return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
  }

  draw(cnv) {
    let leftctrx = this.posx - this.drx;
    let rightctrx = this.posx + this.drx;
    let cx = rightctrx + this.drx * Math.cos(this.ang);
    let cy = this.posy + this.drx * Math.sin(this.ang);
    let ctx = cnv.getContext("2d");

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.posx, this.posy);
    ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
    ctx.lineTo(this.posx, this.posy + this.h);
    ctx.lineTo(cx, cy);
    ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
    ctx.closePath();
    ctx.fill();
  }

  mouseOver(mx, my) {
    let leftctrx = this.posx - this.drx;
    let rightctrx = this.posx + this.drx;
    let qx = this.posx - 2 * this.drx;
    let qy = this.posy - this.drx;
    let qwidth = 4 * this.drx;
    let qheight = this.drx + this.h;

    let x2 = this.posx;
    let y2 = this.posy + this.h;
    let m = (this.h) / (2 * this.drx);

    //quick test if it is in bounding rectangle
    if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
      return false;
    }

    //compare to two centers
    if (this.sqDist(mx, my, leftctrx, this.posy) < this.radsq)
      return true;
    if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq)
      return true;

    // if outside of circles AND less than equal to y, return false
    if (my <= this.posy)
      return false;

    // compare to each slope
    // left side
    if (mx <= this.posx) {
      if (my < (m * (mx - x2) + y2)) {
        return true;
      }
      return false;
    } else { //right side
      m = -m;
      if (my < (m * (mx - x2) + y2)) {
        return true;
      }
      return false;
    }
  }
}
