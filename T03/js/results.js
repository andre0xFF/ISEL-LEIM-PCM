function populate_results() {

  data = get_data()

  for (key in data) {

    append_childs(data[key], document.getElementById(key))
  }
}

function append_childs(childs, parent) {

  for (key in childs) {

      var elm = document.createElement('span')
      var child_elm = document.createTextNode(key + ': ' + childs[key])
      var br = document.createElement('br')

      elm.appendChild(child_elm)
      elm.appendChild(br)
      parent.appendChild(elm)
    }
}
