function modelBlock (additional) {
  var arr = new Array(128)
  for (var i = 0; i < 128; i++) {
    arr[i] = 128
  }
  var block = {
    data: arr,
    dataPos: 0,
    dataSpeed: 0.25
  }
  additional = additional || {}
  for (var key in additional) {
    if (Object.prototype.hasOwnProperty.call(additional, key)) {
      block[key] = additional[key]
    }
  }
  return block
}

module.exports = function createModel () {
  return {
    active: 'oscillator',
    oscillator: modelBlock({
      label: 'Frequency',
      type: 'triangle'
    }),
    gain: modelBlock({
      label: 'Gain'
    }),
    filterFrequency: modelBlock({
      label: 'Filter frequency',
      type: 'allpass'
    }),
    filterQ: modelBlock({
      label: 'Filter resonance',
      multiplier: 1
    }),
    echo: {
      label: 'Echo',
      length: 0.1,
      sustain: 0.5
    }
  }
}
