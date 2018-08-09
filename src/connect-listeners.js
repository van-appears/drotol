module.exports = function connectListeners (model) {
  var active = model[model.active]
  var speed = document.querySelector('#speed')
  var filterType = document.querySelector('#filterType')
  var echoEnabled = document.querySelector('#echoOnOff')
  var echoLength = document.querySelector('#echoLength')
  var echoSustain = document.querySelector('#echoSustain')
  var activeControlLabel = document.querySelector('.what')
  var body = document.querySelector('body')

  function setLabel(label, attr) {
    activeControlLabel.innerHTML = label
  }

  function selectOscillatorType(type) {
    document.querySelector(
      'input[name="oscillatorType"][value="' + type + '"]').click();
  }

  function radioClick (evt) {
    var selected = evt.target.value
    body.className = 'selected_' + selected
    model.active = selected
    active = model[selected]

    setLabel(active.label, active.type)
    speed.value = (Math.log(active.dataSpeed) / Math.log(2)) + 2
    if (selected === 'oscillator1Frequency') {
      selectOscillatorType(model.oscillator1Frequency.type)
    } else if (selected === 'oscillator2Frequency') {
      selectOscillatorType(model.oscillator2Frequency.type)
    }
  }

  function speedChange (evt) {
    active.dataSpeed = Math.pow(2, evt.target.value - 2)
  }

  function echoLengthChange (evt) {
    active.length = evt.target.value
  }

  function echoSustainChange (evt) {
    active.sustain = evt.target.value
  }

  function echoEnabledChange (evt) {
    active.enabled = evt.target.checked
  }

  function filterTypeChange (evt) {
    var selected = evt.target.value
    model.filterFrequency.type = selected
    setLabel(active.label, model.filterFrequency.type)

    switch (selected) {
      case 'notch':
      case 'bandpass':
        model.filterQ.multiplier = 30
        model.filterQ.label = 'Filter bandwidth'
        break
      default:
        model.filterQ.multiplier = 20
        model.filterQ.label = 'Filter resonance'
    }
  }

  function oscillatorTypeChange (evt) {
    active.type = evt.target.value
  }

  speed.addEventListener('input', speedChange)
  echoLength.addEventListener('change', echoLengthChange)
  echoSustain.addEventListener('input', echoSustainChange)
  echoEnabled.addEventListener('change', echoEnabledChange)

  var radios = document.querySelectorAll('input[name="box"]')
  for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = radioClick
  }
  radios[0].click()

  var filterTypeRadios = document.querySelectorAll('input[name="filterType"]')
  for (var i = 0; i < filterTypeRadios.length; i++) {
    filterTypeRadios[i].onclick = filterTypeChange
  }
  filterTypeRadios[0].click()

  var oscillatorTypeRadios= document.querySelectorAll('input[name="oscillatorType"]')
  for (var i = 0; i < oscillatorTypeRadios.length; i++) {
    oscillatorTypeRadios[i].onclick = oscillatorTypeChange
  }
  oscillatorTypeRadios[0].click()
}
