class Colorizer {

  constructor() {}

	// http://www.december.com/html/spec/color16codes.html
  static get_colors_hex() {
    return {
			'black': '#000000',
			'gray': '#808080',
			'silver': '#C0C0C0',
			'white': '#FFFFFF',
			'maroon': '#800000',
			'red': '#FF0000',
			'olive': '#808000',
			'yellow': '#FFFF00',
			'green': '#008000',
			'lime': '#00FF00',
			'teal': '#008080',
			'aqua': '#00FFFF',
			'navy': '#000080',
			'blue': '#0000FF',
			'purple': '#800080',
			'fuchsia': '#FF00FF'
    }
  }

	static get_colors_rgb() {
		let hex = Colorizer.get_colors_hex()
		let rgb = {}

		for (var i = 0; i < Object.keys(hex).length; i++) {
			rgb[Object.keys(hex)[i]] = Colorizer.hex_to_rgb(hex[Object.keys(hex)[i]])
		}

		return rgb
	}

  static parse_hex(color_name) {
    let colors = Colorizer.get_colors_hex()

    for (let i = 0; i < Object.keys(colors).length; i++) {
      let k = Object.keys(colors)[i]

      if (k === color_name) {
        return colors[k]
      }
    }

		return ''
  }

	static parse_rgb(color_name) {
		let hex = Colorizer.parse_hex(color_name)
		return Colorizer.hex_to_rgb(hex)
	}

	static rgb_to_hex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	static hex_to_rgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
	}

  static manhattan_distance(rgb_01, rgb_02) {
    return {
			r: Math.abs(rgb_02.r - rgb_01.r),
			g: Math.abs(rgb_02.g - rgb_01.g),
			b: Math.abs(rgb_02.b - rgb_01.b)
		}
  }

	static get_color_properties(color_name) {
		return {
			name: color_name,
			rgb: Colorizer.parse_rgb(color_name),
			hex: Colorizer.parse_hex(color_name)
		}
	}

  static rgb_to_hsv(rc, gc, bc) {
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
    return { h: h, s: s, v: v};
  }
}

// Class to compute the Color Histogram algorithm. It receives the colors and computes the histogram
class ColorHistogram {

  constructor() {
		this.values = []
		this.dominant = { name: '', rgb: {}, hex: '' }
    this.limits = {
      rgb: 160,
      r: 70, g: 70, b: 70
    }
  }

	get_dominant() {
		return this.dominant
	}

	get_dominant_quantity() {
		return this.values[this.dominant.name]
	}

	get_histogram() {
		return this.values
	}

	compute(pixels) {
		let colors = Colorizer.get_colors_rgb()
		let dominant = 0

		for (let i = 0; i < Object.keys(colors).length; i++) {
			let color = Object.keys(colors)[i]
			this.values[color] = 0

			for (let j = 0; j < pixels.data.length; j += 4) {
				let rgb = { r: pixels.data[j + 0], g: pixels.data[j + 1], b: pixels.data[j + 2]}
				let d = Colorizer.manhattan_distance(colors[color], rgb)

				if (this.check_limits(d)) {
					this.values[color] += 1
				}
			}

			if (this.values[color] > dominant) {
				this.dominant.name = color
				dominant = this.values[color]
			}
		}

		this.dominant = Colorizer.get_color_properties(this.dominant.name)
	}

  check_limits(distance_array) {
    return (
      (distance_array.r + distance_array.g + distance_array.b) < this.limits.rgb &&
      distance_array.r < this.limits.r &&
      distance_array.g < this.limits.g &&
      distance_array.b < this.limits.b
    )
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

	compute() {
		return ''
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
