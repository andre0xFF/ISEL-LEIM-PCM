// The code presented in this file is my authority. The rest of the code in the
// rest of the files was provided to complete the project.
// Andre' Fonseca 39758

class Bear extends DrawingObjects {

  constructor(x, y, radius, color) {

    super(x, y, 'B');
    this.radius = radius;
    this.color = color;
    this.contrast_color = "white";
    this.head_color = "#5b0e0e";

    this.head = new Oval(this.posx, this.posy, this.radius / 1.5, 1, 1, this.head_color);

    this.left_inner_ear = new Oval(this.posx - this.radius / 2, this.posy - this.radius / 2, this.radius / 5, 1, 1, this.color);
    this.right_inner_ear = new Oval(this.posx + this.radius / 2, this.posy - this.radius / 2, this.radius / 5, 1, 1, this.color);

    this.left_outter_eye = new Oval(this.posx - this.radius / 4, this.posy - this.radius / 5, this.radius / 10, 1, 1, this.color);
    this.right_outter_eye = new Oval(this.posx + this.radius / 4, this.posy - this.radius / 5, this.radius / 10, 1, 1, this.color);
    this.left_inner_eye = new Oval(this.posx - this.radius / 4 - 4, this.posy - this.radius / 5 - 4, this.radius / 30, 1, 1, this.contrast_color);
    this.right_inner_eye = new Oval(this.posx + this.radius / 4 - 4, this.posy - this.radius / 5 - 4, this.radius / 30, 1, 1, this.contrast_color);

    this.outter_nouse = new Oval(this.posx, this.posy, this.radius / 6, 1.2, 1, this.color);
    this.inner_nouse = new Oval(this.posx - 10, this.posy - 7, this.radius / 30, 1.2, 1, this.contrast_color);
  }

  mouseOver(mx, my) {

    return (Math.sqrt(Math.pow(mx - this.posx, 2) + Math.pow(my - this.posy, 2)) <= this.radius);
  }

  update() {

    this.head.update(this.posx, this.posy, this.radius / 1.5)

    this.left_inner_ear.update(this.posx - this.radius / 2, this.posy - this.radius / 2, this.radius / 5)
    this.right_inner_ear.update(this.posx + this.radius / 2, this.posy - this.radius / 2, this.radius / 5)

    this.left_outter_eye.update(this.posx - this.radius / 4, this.posy - this.radius / 5, this.radius / 10)
    this.right_outter_eye.update(this.posx + this.radius / 4, this.posy - this.radius / 5, this.radius / 10)

    this.left_inner_eye.update(this.posx - this.radius / 4 - 4, this.posy - this.radius / 5 - 4, this.radius / 30)
    this.right_inner_eye.update(this.posx + this.radius / 4 - 4, this.posy - this.radius / 5 - 4, this.radius / 30)

    this.outter_nouse.update(this.posx, this.posy, this.radius / 6)
    this.inner_nouse.update(this.posx - 10, this.posy - 7, this.radius / 30)
  }

  draw(cnv) {

    let ctx = cnv.getContext("2d");

    this.update()

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
    this.height = width / 1.3;
    this.color = color;
    this.contrast_color = "white";
  }

  mouseOver(mx, my) {

    return (
      mx > this.posx - this.width / 2 && mx < this.posx + this.width / 2 &&
      my > this.posy - this.height / 2 && my < this.posy + this.height / 2
    );
  }

  draw(cnv) {

    let ctx = cnv.getContext("2d");

    ctx.save();
    {
      ctx.translate(this.posx, this.posy);
      var r = 35;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      // feet
      ctx.moveTo(0, 30);
      ctx.lineTo(-(this.width / 2 - 10) / 2, 50);
      ctx.lineTo(-(this.width / 2 - 10), 30);
      ctx.lineTo(-65, 50);
      // body
      ctx.lineTo(-65, 50 - (this.height - r));
      // head
      ctx.arc(-30, 50 - (this.height - r), r, Math.PI, 3 * Math.PI / 2, false);
      ctx.lineTo(-30 + (this.width - r * 2) / 2, (50 - (this.height - r)) - r);
      ctx.fill();

      ctx.beginPath();
      // feet
      ctx.moveTo(0, 30);
      ctx.lineTo(+(this.width / 2 - 10) / 2, 50);
      ctx.lineTo(+(this.width / 2 - 10), 30);
      ctx.lineTo(+65, 50);
      // body
      ctx.lineTo(+65, 50 - (this.height - r));
      // head
      ctx.arc(+30, 50 - (this.height - r), r, 0, 3 * Math.PI / 2, true);
      ctx.lineTo(+30 - (this.width - r * 2) / 2, (50 - (this.height - r)) - r);
      ctx.fill();

      // eyes
      ctx.fillStyle = this.contrast_color;
      ctx.beginPath();
      ctx.arc(-30, 50 - (this.height - r), 20, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(-30 - 10, 50 - (this.height - r) + 10, 5, 0, 2 * Math.PI, true);
      ctx.fill();

      ctx.fillStyle = this.contrast_color;
      ctx.beginPath();
      ctx.arc(+30, 50 - (this.height - r), 20, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(+30 - 10, 50 - (this.height - r) + 10, 5, 0, 2 * Math.PI, true);
      ctx.fill();

    }
    ctx.restore();
  }
}
