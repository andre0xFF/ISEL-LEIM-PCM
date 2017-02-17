// This code is not of my authority. It was provided to develop the rest of the website
class Picture {

  constructor(px, py, w, h, impath, cat) {
    this.posx = px;
    this.posy = py;
    this.w = w;
    this.h = h;

    this.impath = impath;
    this.imgobj = new Image();
    this.imgobj.src = this.impath;

    this.original_w = this.imgobj.width;
    this.original_h = this.imgobj.height;
    this.category = cat;

		this.histogram = new ColorHistogram()
		this.moments = new ColorMoments()
  }

	get_path() {
		return this.imgobj.src
	}

	get_category() {
		return this.category
	}

  setPosition(px, py) {
    this.posx = px;
    this.posy = py;
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

	process(canvas, eventP) {
		let ctx = canvas.getContext('2d')
		let self = this

		this.imgobj.addEventListener('load', function() {
			ctx.drawImage(self.imgobj, 0, 0, self.imgobj.width, self.imgobj.height)
			let pixels = ctx.getImageData(0, 0, self.imgobj.width, self.imgobj.height)
			self.histogram.compute(pixels)
			self.moments.compute(self.imgobj, canvas)
			document.dispatchEvent(eventP)
		}, false)
	}

  //method to apply the algorithms to the image.
  //Because the image have to be loaded from the server, the same strategy used in the method draw()
  //is used here to access the image pixels. We do not know exactly when the image is loaded and computed.
  //For this reason the event "processed_picture" was created to alert the application (ISearchEngine)
  computation(cnv, histcol, colorMom, eventP) {
    let ctx = cnv.getContext("2d");

    if (this.imgobj.complete) {
      console.log("Debug: N Time");
      ctx.drawImage(this.imgobj, 0, 0, this.imgobj.width, this.imgobj.height);
      let pixels = ctx.getImageData(0, 0, this.imgobj.width, this.imgobj.height);
      // let pixels = Generate_Image(cnv);
      this.hist = histcol.count_Pixels(pixels);
      // this.build_Color_Rect(cnv, this.hist, histcol.redColor, histcol.greenColor, histcol.blueColor);
      // this.color_moments = colorMom.moments(this.imgobj, cnv);
      document.dispatchEvent(eventP);

    } else {
      console.log("Debug: First Time");
      let self = this;
      this.imgobj.addEventListener('load', function () {
        ctx.drawImage(self.imgobj, 0, 0, self.imgobj.width, self.imgobj.height);
        let pixels = ctx.getImageData(0, 0, self.imgobj.width, self.imgobj.height);
        // let pixels = Generate_Image(cnv);
        self.hist = histcol.count_Pixels(pixels);
        self.build_Color_Rect(cnv, self.hist, histcol.redColor, histcol.greenColor, histcol.blueColor);
        //self.color_moments = colorMom.moments(self.imgobj, cnv);
        document.dispatchEvent(eventP);
      }, false);
    }

    // this method should be completed by the students

  }

  // Method used to debug. It shows the color and the correspondent number of pixels of the histogram
  build_Color_Rect(cnv, hist, redColor, greenColor, blueColor) {
    let ctx = canvas.getContext("2d");
    let text_y = 390;
    let rect_y = 400;
    let hor_space = 80;

    ctx.font = "12px Arial";
    for (let c = 0; c < redColor.length; c++) {
      ctx.fillStyle = "rgb(" + redColor[c] + "," + greenColor[c] + "," + blueColor[c] + ")";
      ctx.fillRect(c * hor_space, rect_y, 50, 50);
      if (c === 8) {
        ctx.fillStyle = "black";
      }
      ctx.fillText(hist[c], c * hor_space, text_y);
    }
  }

  mouseOver(mx, my) {
    if ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h))) {
      return true;
    }
    return false;
  }
}
