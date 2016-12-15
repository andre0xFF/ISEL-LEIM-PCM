// The code presented in this file is my authority. The rest of the code in the
// rest of the files was provided to complete the project.
// Andre' Fonseca 39758

class Bear extends DrawingObjects {

  constructor(x, y, radius, color) {

    super(x, y, 'B');
    this.radius = radius;
    this.color = color;
    this.contrast_color = "white";

    this.frame = new Rect(this.posx - this.radius, this.posy - this.radius, this.radius * 2, this.radius * 2, this.color);

    this.head = new Oval(this.posx, this.posy, this.radius / 1.5, 1, 1, this.contrast_color);

    this.left_outter_ear = new Oval(this.posx - this.radius / 2, this.posy - this.radius / 2, this.radius / 4, 1, 1, this.contrast_color);
    this.right_outter_ear = new Oval(this.posx + this.radius / 2, this.posy - this.radius / 2, this.radius / 4, 1, 1, this.contrast_color);
    this.left_inner_ear = new Oval(this.posx - this.radius / 2, this.posy - this.radius / 2, this.radius / 5, 1, 1, this.color);
    this.right_inner_ear = new Oval(this.posx + this.radius / 2, this.posy - this.radius / 2, this.radius / 5, 1, 1, this.color);

    this.left_outter_eye = new Oval(this.posx - this.radius / 4, this.posy - this.radius / 5, this.radius / 10, 1, 1, this.color);
    this.right_outter_eye = new Oval(this.posx + this.radius / 4, this.posy - this.radius / 5, this.radius / 10, 1, 1, this.color);
    this.left_inner_eye = new Oval(this.posx - this.radius / 4 - 4, this.posy - this.radius / 5 - 4, this.radius / 30, 1, 1, this.contrast_color);
    this.right_inner_eye = new Oval(this.posx + this.radius / 4 - 4, this.posy - this.radius / 5 - 4, this.radius / 30, 1, 1, this.contrast_color);

    this.outter_nouse = new Oval(this.posx, this.posy, this.radius / 6, 1.2, 1, this.color);
    this.inner_nouse = new Oval(this.posx - 10, this.posy - 7, this.radius / 30, 1.2, 1, this.contrast_color);
  }

  mouseOver(mx, my) {}

  draw(cnv) {

    let ctx = cnv.getContext("2d");

    this.frame.draw(cnv);
    this.left_outter_ear.draw(cnv);
    this.right_outter_ear.draw(cnv);
    this.left_inner_ear.draw(cnv);
    this.right_inner_ear.draw(cnv);
    this.head.draw(cnv);
    this.left_outter_eye.draw(cnv);
    this.right_outter_eye.draw(cnv);
    this.left_inner_eye.draw(cnv);
    this.right_inner_eye.draw(cnv);
    this.outter_nouse.draw(cnv);
    this.inner_nouse.draw(cnv);

    ctx.save();
    {
      ctx.translate(this.posx, this.posy + (this.radius / 6) * 1.2);
      ctx.strokeStyle = this.color;
      ctx.scale(1.2, 1);
      ctx.beginPath();
      ctx.arc(-10, 0, 10, 0, Math.PI, false);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(10, 0, 10, 0, Math.PI, false);
      ctx.stroke();
      ctx.closePath();
    }
    ctx.restore();
  }
}

class Ghost extends DrawingObjects {

  constructor(x, y, width, color) {

    super(x, y, 'G');
    this.width = width;
  }

  mouseOver(mx, my) {}

  draw(cnv) {

    let ctx = cnv.getContext("2d");
  }
}
