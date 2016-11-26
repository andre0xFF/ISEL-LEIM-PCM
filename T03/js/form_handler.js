var FORM_NAME = 'form_data'
var N_RESPONSES_STRING = 'form_n_responses'
var PROGRESS_INCREMENT = 100/22

var elms_with_input = []

function handle_form() {
  // get number of responses
  var n_responses = parseInt(localStorage.getItem(N_RESPONSES_STRING)) || 0
  // get localStorage data
  var data = get_data()
  // get and join form data
  data = update_data(data)
  // save data to localStorage
  localStorage.setItem(FORM_NAME, JSON.stringify(data))
  localStorage.setItem(N_RESPONSES_STRING, ++n_responses)

  console.log(data)

  // read_data(data)

  // redirect to other page
}

function get_data() {

  return JSON.parse(localStorage.getItem(FORM_NAME)) || {}
}

function update_data(data) {

  var elements = document.forms['t03']

  for (var i = 0; i < elements.length; i++) {

    var elm = elements[i]

    if ((elm.type === 'radio' && elm.checked || elm.type === 'range') && check_user_input(elm.name)) {
      // create keys
      if (data[elm.name] === undefined) {

        data[elm.name] = {}
      }
      if (data[elm.name][elm.value] === undefined) {

        data[elm.name][elm.value] = 0
      }

      data[elm.name][elm.value]++
    }
    else if (elm.tagName === 'TEXTAREA' && elm.value !== '' && check_user_input(elm.name)) {
      // create keys
      if (data[elm.name] === undefined) {

        data[elm.name] = []
      }

      data[elm.name].push(elm.value)
    }
  }

  data = global_evaluation(data)

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

function check_user_input(name) {

  if (elms_with_input.indexOf(name) === -1) {

    return false
  }

  return true
}

function increment_progress_bar(evt) {

  if (!check_user_input(evt.target.name)) {

    elms_with_input.push(evt.target.name)
    document.getElementById('progress_bar').value += PROGRESS_INCREMENT
  }

  if (evt.target.tagName === 'TEXTAREA' && evt.target.value === '') {

    elms_with_input.pop(evt.target.name)
    document.getElementById('progress_bar').value -= PROGRESS_INCREMENT
  }

}

/**
 * Calculates the average of each item in global evaluation
 */
function global_evaluation(data) {

  var key_string = 'global_evaluation_01'
  var keys = ['01', '02', '03', '04']

  for (var i = 0; i < keys.length; i++) {

    var total = 0
    var weight = 0
    var values = data[key_string + '_' + keys[i]]
    delete data[key_string + '_' + keys[i]]

    for (key in values) {

      total += parseInt(key) * values[key]
      weight += values[key]
    }

    if (data[key_string] === undefined) {

      data[key_string] = {}
    }

    // data[key_string][i + 1] = data[key_string][i + 1] === undefined ? (total / weight) : ((data[key_string][i + 1] + weight) / 2)
    data[key_string][i + 1] = ((data[key_string][i + 1] + total) / 2) || (total / weight)
  }

  return data
}
