class Images_engine {

	constructor(xml_path, canvas) {
		this.canvas = canvas
		this.pictures_per_category = 1
		this.categories = [
			'beach', 'birthday', 'face', 'indoor', 'people', 'snow',
			'manmade/artificial',	'manmade/manmade', 'manmade/urban',
			'nature', 'no_people', 'outdoor', 'party'
		]
		this.dao = new DAO(xml_path)
		this.pictures = new Pictures_pool(this.categories)
	}

	get_categories() {
		return this.categories
	}

	process() {
		for (let i = 0; i < this.categories.length; i++) {
			let paths = this.dao.get_images_paths(this.categories[i], this.pictures_per_category)

			for (let j = 0; j < paths.length; j++) {
				this.image_process(paths[j], this.categories[i])
			}
		}
		// console.log('')
		// this.image_process("./Images/daniel1.jpg", 'test')
	}

	image_process(path, category) {
		let pic = new Picture(0, 0, 100, 100, path, category);
		let event_name = "processed_picture_" + pic.impath;
		let eventP = new Event(event_name);
		let self = this;
		document.addEventListener(event_name, function () {
			self.image_processed(pic, event_name);
		}, false);

		pic.process(this.canvas, eventP)
	}

	image_processed(picture, event_name) {
		console.log(`${this.pictures.get_length()}: ${picture.get_path()} ${picture.histogram.get_dominant().name} ${picture.get_category()}`)
		this.pictures.add(picture)

		if (this.pictures.get_length() === this.pictures_per_category * this.categories.length) {
			let pics_color = this.pictures.get_pictures('colors')
			let pics_cats = this.pictures.get_pictures('categories')
      //this.createXMLColordatabaseLS();
      //this.createXMLIExampledatabaseLS();
			window.location = './index.html'
		}
	}
}

class DAO {

	constructor(xml_path) {
		this.xml_path = xml_path
		this.xml = new XML_Database().loadXMLfile(this.xml_path)
		this.ls = new LocalStorageXML()
	}

	get_images_paths(category, quantity) {
		let db = new XML_Database()
		return db.SearchXML(category, this.xml, quantity)
	}
}

class Pictures_pool {

	constructor(categories) {
		this.pictures = []
		this.lists = {
			categories: {},
			colors: {}
		}

		let colors = Object.keys(Colorizer.get_colors_rgb())

		for (let i = 0; i < categories.length; i++) {
			this.lists.categories[categories[i]] = []
		}
		for (let i = 0; i < colors.length; i++) {
			this.lists.colors[colors[i]] = []
		}
	}

	get_length() {
		return this.pictures.length
	}

	add(picture) {
		let category = picture.get_category()
		let color = picture.histogram.get_dominant().name
		let i = this.pictures.length

		this.pictures.push(picture)
		this.lists.categories[category].push(i)
		this.lists.colors[color].push(i)
	}

	get_by_color(color) {
		if (this.lists.colors[color] === undefined) {
			return null
		}

		let pictures = []
		for (let i = 0; i < this.lists.colors[color].length; i++) {
			let idx = this.lists.colors[color][i]
			pictures.push(this.pictures[idx])
		}

		pictures.sort(function(a, b) {
			return b.histogram.get_dominant_quantity() - a.histogram.get_dominant_quantity()
		})

		return pictures
	}

	get_pictures(list) {
		let pictures = {}

		for (let i = 0; i < Object.keys(this.lists[list]).length; i++) {
			let key = Object.keys(this.lists[list])[i]

			if (list === 'color') {
				pictures[key] = this.get_by_color(key)
			} else if (list === 'categories') {
				pictures[key] = this.get_by_category(key)
			}
		}

		return pictures
	}

	get_by_category(category) {
		if (this.lists.categories[category] === undefined) {
			return null
		}

		let pictures = []
		for (let i = 0; i < this.lists.categories[category].length; i++) {
			pictures.push(this.lists.categories[category][i])
		}

		return pictures
	}

}
