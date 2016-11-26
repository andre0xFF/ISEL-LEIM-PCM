function populate_results() {

  data = get_data()

  for (key in data) {

    node = create_node(data[key])

    var parent = document.getElementById(key)
    parent.appendChild(node)
  }
}

function create_node(node) {

  for (key in node) {

    var elm = document.createElement('span')
    var node = document.createTextNode(key + ' ' + node[key])
    elm.appendChild(node)
  }
}
