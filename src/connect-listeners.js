var speed = document.querySelector('#speed')
var filterType = document.querySelector('#filterType')
var oscillatorType = document.querySelector('#oscillatorType')
var echoLength = document.querySelector('#echoLength')
var echoSustain = document.querySelector('#echoSustain')
var model = {}
var active = {}

function radioClick (evt) {
  var selected = evt.target.value
  var what = document.querySelector('.what')
  document.querySelector('body').className = 'selected_' + selected

  model.active = selected
  active = model[selected]
  if (active) {
    speed.value = Math.log(active.dataSpeed) / Math.log(2)
    what.innerHTML = active.label
  }
}

function speedChange (evt) {
  active.dataSpeed = Math.pow(2, evt.target.value)
}

function echoLengthChange (evt) {
  active.length = evt.target.value
}

function echoSustainChange (evt) {
  active.sustain = evt.target.value
}

function filterTypeChange (evt) {
  var selected = evt.target.value
  model.filterFrequency.type = selected
  console.log("?????",model.filterFrequency)
  switch (selected) {
    case 'notch':
    case 'bandpass':
      model.filterQ.multiplier = 30
      model.filterQ.label = 'Filter bandwidth'
      break
    default:
      model.filterQ.multiplier = 1
      model.filterQ.label = 'Filter resonance'
  }
}

function oscillatorTypeChange (evt) {
  model.oscillator.type = evt.target.value
}

module.exports = function connectListeners (_model) {
  model = _model
  active = model[model.active]

  speed.value = active.dataSpeed
  speed.addEventListener('input', speedChange)

  echoLength.value = model.echo.length
  echoLength.addEventListener('change', echoLengthChange)

  echoSustain.value = model.echo.sustain
  echoSustain.addEventListener('input', echoSustainChange)

  filterType.value = model.filterFrequency.type
  filterType.addEventListener('change', filterTypeChange)

  oscillatorType.value = model.oscillator.type
  oscillatorType.addEventListener('change', oscillatorTypeChange)

  var radios = document.querySelectorAll('input[name="box"]')
  for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = radioClick
  }
  radios[0].click()
}
