// Class to compute the Color Histogram algorithm. It receives the colors and computes the histogram
class ColorHistogram {

  constructor(redColor, greenColor, blueColor) {

    this.redColor = redColor;
    this.greenColor = greenColor;
    this.blueColor = blueColor;
    this.limits = {
      rgb: 160,
      red: 70,
      green: 70,
      blue: 70
    }
  }

  count_Pixels(pixels) {

    let histogram = []

    for (let i = 0; i < this.redColor.length; i++) {
      histogram[i] = 0
      let color = [this.redColor[i], this.greenColor[i], this.blueColor[i]]

      for (let j = 0; j < pixels.data.length; j += 4) {
        let d = this.calc_manhattan_distance(color, [pixels.data[j + 0], pixels.data[j + 1], pixels.data[j + 2]])

        if (this.check_limits(d)) { histogram[i] += 1 }
      }
    }

    return histogram
  }

  check_limits(distance_array) {

    return (
      (distance_array[0] + distance_array[1] + distance_array[2]) < this.limits.rgb &&
      distance_array[0] < this.limits.red &&
      distance_array[1] < this.limits.green &&
      distance_array[2] < this.limits.blue
    )
  }

  calc_manhattan_distance(rgb_01, rgb_02) {

    return [ Math.abs(rgb_02[0] - rgb_01[0]), Math.abs(rgb_02[1] - rgb_01[1]), Math.abs(rgb_02[2] - rgb_01[2]) ]
  }
}

//Class to compute the Color Moments algorithm. It computes the statistics moments
//through the method moments(). The moments are computed in the HSV color space. The method rgdToHsv is used
//to translate the pixel into the HSV color space
class ColorMoments {
  constructor() {
    this.h_block = 3;
    this.v_block = 3;
  }

  rgbToHsv(rc, gc, bc) {
    let r = rc / 255;
    let g = gc / 255;
    let b = bc / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = null,
      s = null,
      v = max;

    let dif = max - min;
    s = max == 0
      ? 0
      : dif / max;

    if (max == min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / dif + (g < b
            ? 6
            : 0);
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
  }

  moments(imgobj, cnv) {
    let wBlock = Math.floor(imgobj.width / this.h_block);
    let hBlock = Math.floor(imgobj.height / this.v_block);
    let n = wBlock * hBlock;
    let descriptor = [];

    let ctx = cnv.getContext("2d");
    ctx.drawImage(imgobj, 0, 0);

    // this method should be completed by the students

  }
}
