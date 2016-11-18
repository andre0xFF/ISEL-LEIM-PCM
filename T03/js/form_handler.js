var FORM_NAME = 'form_data'
var N_RESPONSES_STRING = 'form_n_responses'

function handle_form() {

  var data = {}
  var n_responses

  // get number of responses
  this.n_responses = localStorage.getItem(N_RESPONSES_STRING)
  this.n_responses = this.n_responses === null ? 0 : this.n_responses

  // get localStorage data
  var data_string = localStorage.getItem(FORM_NAME)
  try {

    data = data_string === null ? {} : JSON.parse(data_string)
  } catch(e) {
    console.log(e)
  }

  // get and join form data
  data = join_form_data(data)

  // save data to localStorage
  localStorage.setItem(FORM_NAME, JSON.stringify(data))
  localStorage.setItem(N_RESPONSES_STRING, ++n_responses)

  console.log(data)

  // redirect to other page
}

function join_form_data(data) {

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
