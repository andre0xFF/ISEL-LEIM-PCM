function load_xml() {
	let canvas = document.getElementById('canvas')
	let app = new Images_engine('./xml/Image_database.xml', canvas)
	app.process()
}

class Images_engine {

	constructor(xml_path, canvas) {
		this.canvas = canvas
		this.pictures_per_category = 50
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
			localStorage.clear()
			this.dao.save_in_ls(this.pictures.get_pictures())
			window.location = './index.html'
		}
	}
}

class DAO {

	constructor(xml_path) {
		this.xml_path = xml_path
		// this.xml = new XML_Database().loadXMLfile(this.xml_path)
		this.xml = new XML_Database()
		this.ls = new LocalStorageXML()
	}

	get_images_paths(category, quantity) {
		return this.xml.SearchXML(category, this.xml.loadXMLfile(this.xml_path), quantity)
	}

	save_in_ls(pictures) {
		for (let i = 0; i < Object.keys(pictures).length; i++) {
			let category = Object.keys(pictures)[i]
			let category_xml = this.generate_category_xml(pictures[category])
			this.ls.saveLS_XML(category, category_xml)
		}
	}

	get_from_ls(category, color) {
			let xml_doc = this.ls.readLS_XML(category)
			return this.xml.SearchXML(color, xml_doc, 30)
	}

	generate_picture_xml(picture) {
		return `<image class="${picture.histogram.get_dominant().name}"><path>${picture.get_path()}</path></image>`
	}

	generate_category_xml(category) {
		let xml = '<images>'
		for (let j = 0; j < Object.keys(category).length; j++) {
			let color = Object.keys(category)[j]

			category[color].sort(function(a, b) {
				return b.histogram.get_dominant_quantity() - a.histogram.get_dominant_quantity()
			})

			for (let i = 0; i < category[color].length; i++) {
				xml += this.generate_picture_xml(category[color][i])
			}
		}
		return xml + '</images>'
	}
}

class Pictures_pool {

	constructor() {
		this.pictures = []
		this.lists = {}
		this.count = 0
	}

	get_length() {
		return this.count
	}

	add(picture) {
		let category = picture.get_category()
		let color = picture.histogram.get_dominant().name

		if (this.lists[category] === undefined) {
			this.lists[category] = {}
		}

		if (this.lists[category][color] === undefined) {
			this.lists[category][color] = []
		}

		this.lists[category][color].push(picture)
		this.count++
	}

	get_pictures() {
		return this.lists
	}

}
