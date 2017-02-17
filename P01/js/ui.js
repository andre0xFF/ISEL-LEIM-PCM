class UI {

   constructor(images_element) {
		 this.query = {
			 color_picker: '',
			 image_path: '',
			 tooltips: []
		 }
		 this.images = {
			 container: images_element,
			 db: ''
		 }
		 this.engine = new Images_engine()
     this.color_picker = ''
     this.image_path = ''
		 this.querys = []
		 this.tooltips = engine.get_categories()
		 this.images_element = images_element
		 this.add_images()
   }

   set_color(color) {
     this.color_picker = color
   }

   set_image(path) {
     this.image_path = path
   }

	 get_last_query() {
		 return this.querys[this.querys.length - 1]
	 }

	query(text) {
		let colors = []

		if (this.color_picker !== '') {
			text += ' ' + this.color_picker
		}

		let splited = text.split(' ')
		let colors_list = new Decipher(Object.keys(Colorizer.get_colors_hex()))

		for (let i = 0; i < splited.length; i++) {
			// check if word is a color word
			let colors_name = colors_list.contains(splited[i])

			for (let j = 0; j < colors_name.length; j++) {
				// loop all colors match
				let hex = Colorizer.parse_hex(colors_name[j])
				colors.push(hex)
			}

			if (Colorizer.is_hex(splited[i])) {
				// push color
				colors.push(splited[i])
			}
		}

		this.querys.push(text)
		// TODO execute query
	}

	 push_color(color) {
		 this.colors.push(color)
	 }

   reload_data() {
     // delete local storage data if any
     // load data to local storage

     let redirect = function () {
        window.location = './index.html'
     }
     setTimeout(redirect, 3000)
   }

	 get_tooltip_words(text) {
		 if (text.length < 0) {
		 	return
		 }

	   let decipher = new Decipher(this.tooltips)
	   let tooltips = decipher.starts_with(text)

		 return tooltips
	 }

	 add_images() {
		 // TODO complete with images
		 for (let i = 0; i < 20; i++) {
			 let img = document.createElement('img')
			 let anchor = document.createElement('a')
			 img.setAttribute('src', './Images/beach/img_1.jpg')
			 anchor.setAttribute('href', './Images/beach/img_1.jpg')
			 anchor.append(img)
			 this.images_element.append(anchor)
		 }

	 }
}

class Decipher {

  constructor(set) {
    this.set = set
  }

  contains(text) {
    let results = []

    for (let i = 0; i < this.set.length; i++) {
      if (this.set[i].includes(text) || text.includes(this.set[i])) {
        results.push(this.set[i])
      }
    }

    return results
  }

	starts_with(text) {
		let results = []

		for (let i = 0; i < this.set.length; i++) {
			if (this.set[i].startsWith(text)) {
				results.push(this.set[i])
			}
		}

		return results
	}
}

let ui = new UI(document.getElementById('images_container'))

function handle_image_onChange() {
  let input = document.getElementById('file-input').value
  ui.set_image(input)
}

function handle_color_onChange() {
  let input = document.getElementById('color-picker').value
  ui.set_color(input)
}

function handle_textfield_onChange() {
  let input = document.getElementById('user-input').value

  if (input.length < 1) {
    return
  }

	ui.query(input)

  let toast = document.getElementById('toast')

  toast.MaterialSnackbar.showSnackbar({
    message: 'Searching for: ' + ui.get_last_query(),
    timeout: 2500
  })
}

function handle_textfield_onInput() {
  let input = document.getElementById('user-input').value
  let tooltip = document.getElementById('user-input__tooltip')

  if (input.length < 3) {
    tooltip.innerHTML = ''
    tooltip.setAttribute('style', 'display: none;')
    return
  }

	let tooltips = ui.get_tooltip_words(input)

	let tip = ''
	for (let i = 0; i < tooltips.length; i++) {
	 tip += tooltips[i] + '<br>'
	}

	if (tip.length > 0) {
    tooltip.innerHTML = tip
    tooltip.setAttribute('style', 'display: inline-block;')
    let elem_class = tooltip.getAttribute('class') + ' is-active'
    tooltip.setAttribute('class', elem_class)
	}
}
