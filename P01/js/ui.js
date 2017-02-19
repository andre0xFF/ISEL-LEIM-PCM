class UI {

   constructor(images_element, colors_element) {
		 this.dao = new DAO('./xml/Image_database.xml')
		 this.query = {
			 history: [],
			 color_picker: '',
			 image_path: '',
			 tooltips: [
	 			'beach', 'birthday', 'face', 'indoor', 'people', 'snow',
	 			'manmade/artificial',	'manmade/manmade', 'manmade/urban',
	 			'nature', 'no_people', 'outdoor', 'party'
	 		]
		 }
		 this.images = {
			 container: images_element,
			 paths: []
		 }

		 // display initial images
		 this.images_element = images_element
		 for (let i = 0; i < this.query.tooltips.length; i++) {
		 	let paths = this.dao.get_images_paths(this.query.tooltips[i], 4)
			this.add_images(paths)
		 }
		 // set available colors
		 let colors = Colorizer.get_colors_hex()
		 for (let i = 0; i < Object.keys(colors).length; i++) {
				let name = Object.keys(colors)[i]
				let option = document.createElement('option')
				option.setAttribute('value', colors[name])
				colors_element.append(option)
		 }
   }

	 get_last_query() {
		 return this.query.history[this.query.history.length - 1]
	 }

	execute_query(textfield_element, color_picker_element, input_file_element, toast_element) {
		// verify input text
		let text = textfield_element.value.toLowerCase()
		if (text === '') { return }
		// run toast
	  toast_element.MaterialSnackbar.showSnackbar({
	    message: 'Searching for: ' + text,
	    timeout: 2500
	  })

		// let file = input_file_element.value

		// filter colors in input
		let colors = Object.keys(Colorizer.get_colors_hex()).filter(function(color) {
			return (
				text.includes(color) || (
					color_picker_element.getAttribute('data-changed') === 'true' &&
					color === Colorizer.get_color_name(color_picker_element.value)
				)
			)
		})
		// filter categories
		let query = this.query.tooltips.filter(function(tooltip) {
			// return text.includes(tooltip) || tooltip.includes(text)
			return text === tooltip
		})
		// remove all images
		while(this.images_element.firstChild) {
			this.images_element.removeChild(this.images_element.firstChild)
		}
		// check if there are any categories to be searched for
		if (query.length === 0) { return }
		// if no color supplied then search for all colors
		if (colors.length === 0) { colors = Colorizer.get_colors_names() }
		// run querys, get images paths and insert img elements
		for (let i = 0; i < query.length; i++) {
			for (let j = 0; j < colors.length; j++) {
				let paths = this.dao.get_from_ls(query[i], colors[j])
				this.add_images(paths)
			}
		}
	}

	 get_tooltip_words(text) {
		 if (text.length < 0) {
			 return
		 }

		 return this.query.tooltips.filter(function(tooltip) {
			 return tooltip.startsWith(text)
		 })
	 }

	set_tooltip(input, tooltip_element) {
		if (input.length < 3) {
			tooltip_element.innerHTML = ''
			tooltip_element.setAttribute('style', 'display: none;')
			return
		}

		let tooltips = ui.get_tooltip_words(input)

		let tip = ''
		for (let i = 0; i < tooltips.length; i++) {
			tip += tooltips[i] + '<br>'
		}

		if (tip.length > 0) {
			tooltip_element.innerHTML = tip
			tooltip_element.setAttribute('style', 'display: inline-block;')
			let elem_class = tooltip_element.getAttribute('class') + ' is-active'
			tooltip_element.setAttribute('class', elem_class)
		}
	}

	 add_images(paths) {
		 if (paths.length === 0) { return }

		 for (let i = 0; i < paths.length; i++) {
			 let img = document.createElement('img')
			 let anchor = document.createElement('a')
			 img.setAttribute('src', paths[i])
			 anchor.setAttribute('href', paths[i])
			 anchor.append(img)
			 this.images_element.append(anchor)
		 }
	 }

}

let ui = new UI(
	document.getElementById('images_container'),
	document.getElementById('colors')
)
let sound = new Audio('./sounds/switch14.mp3');

function handle_image_onChange() {
	document.getElementById('file-input').setAttribute('data-changed', true)
	// run_query()
	// document.getElementById('file-input').setAttribute('data-changed', false)
}

function handle_color_onInput() {
  document.getElementById('color-picker').setAttribute('data-changed', true)
	if (document.getElementById('user-input').value !== '') {
		run_query()
	}
	// run_query()
	// document.getElementById('color-picker').setAttribute('data-changed', false)
}

function handle_textfield_onChange() {
	run_query()
	document.getElementById('user-input').setAttribute('data-changed', false)
	document.getElementById('color-picker').setAttribute('data-changed', false)
	document.getElementById('file-input').setAttribute('data-changed', false)
}

function run_query() {
	sound.play()
	ui.execute_query(
		document.getElementById('user-input'),
		document.getElementById('color-picker'),
		document.getElementById('file-input'),
		document.getElementById('toast')
	)
}

function handle_textfield_onInput() {
	document.getElementById('user-input').setAttribute('data-changed', true)

	ui.set_tooltip(
		document.getElementById('user-input').value,
		document.getElementById('user-input__tooltip')
	)
}
