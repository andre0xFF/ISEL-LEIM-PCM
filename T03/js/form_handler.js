var FORM_NAME = 'form_data'
var N_RESPONSES_STRING = 'form_n_responses'

function handle_form() {

  // get number of responses
  var n_responses = parseInt(localStorage.getItem(N_RESPONSES_STRING)) || 0
  // get localStorage data
  var data = JSON.parse(localStorage.getItem(FORM_NAME)) || {}

  // get and join form data
  data = update_data(data)
  // save data to localStorage
  localStorage.setItem(FORM_NAME, JSON.stringify(data))
  localStorage.setItem(N_RESPONSES_STRING, ++n_responses)

  console.log(data)

  read_data(data)

  // redirect to other page
}

function update_data(data) {

  var elements = document.forms['t03']

  for (var i = 0; i < elements.length; i++) {

    var elm = elements[i]

    if (elm.tagName === 'INPUT' && elm.checked) {
      // create keys
      if (data[elm.name] === undefined) {

        data[elm.name] = {}
      }
      if (data[elm.name][elm.value] === undefined) {

        data[elm.name][elm.value] = 0
      }

      data[elm.name][elm.value]++
    }
    else if (elm.tagName === 'TEXTAREA' && elm.value !== '') {
      // create keys
      if (data[elm.name] === undefined) {

        data[elm.name] = []
      }

      data[elm.name].push([elm.value])
    }
  }

  return data
}

function read_data(data) {

  for (key in data) {
    if (Object.keys(data[key]).length > 0) {

      read_data(data[key])
    }
    else {

      console.log(key, data[key])
    }
  }

}
