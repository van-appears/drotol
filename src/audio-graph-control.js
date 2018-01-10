function updateModelPosition (block) {
  block.dataPos += block.dataSpeed
  if (block.dataPos >= 128) {
    block.dataPos -= 128
  }
}

function updateModelPositions (model) {
  updateModelPosition(model.oscillator)
  updateModelPosition(model.gain)
  updateModelPosition(model.filterFrequency)
  updateModelPosition(model.filterQ)
}

function getScaledValue (block) {
  return (254.0 - block.data[Math.floor(block.dataPos)]) / 254.0
}

module.exports = function audioGraphControl (audioGraph, model) {
  var lastOscillatorType = audioGraph.oscillator.type
  var lastFilterType = audioGraph.filter.type
  var lastEchoLength = audioGraph.delay.delayTime.value

  return function update () {
    if (model.oscillator.type !== lastOscillatorType) {
      lastOscillatorType = model.oscillator.type
      audioGraph.oscillator.type = lastOscillatorType
    }
    if (model.filterFrequency.type !== lastFilterType) {
      lastFilterType = model.filterFrequency.type
      audioGraph.filter.type = lastFilterType
    }
    if (model.echo.length !== lastEchoLength) {
      lastEchoLength = model.echo.length
      audioGraph.delay.delayTime.value = lastEchoLength
    }

    updateModelPositions(model)
    audioGraph.delayGain.gain.value = model.echo.sustain

    var frequency = 60 * Math.pow(8, getScaledValue(model.oscillator))
    audioGraph.oscillator.frequency.value = frequency

    var gain = getScaledValue(model.gain)
    audioGraph.oscillatorGain.gain.value = gain

    var filterFrequency = 60 * Math.pow(100, getScaledValue(model.filterFrequency))
    audioGraph.filter.frequency.value = filterFrequency

    var filterQ = model.filterQ.multiplier * getScaledValue(model.filterQ)
    console.log(">>>", filterQ)
    audioGraph.filter.Q.value = filterQ
  }
}
