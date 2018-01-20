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

function AudioGraphControl (audioGraph, model) {
  this.model = model
  this.audioGraph = audioGraph
  this.lastOscillatorType = audioGraph.oscillator.type
  this.lastFilterType = audioGraph.filter.type
  this.lastEchoLength = audioGraph.delay.delayTime.value
}

AudioGraphControl.prototype.update = function () {
  if (this.model.oscillator.type !== this.lastOscillatorType) {
    this.lastOscillatorType = this.model.oscillator.type
    this.audioGraph.oscillator.type = this.lastOscillatorType
  }
  if (this.model.filterFrequency.type !== this.lastFilterType) {
    this.lastFilterType = this.model.filterFrequency.type
    this.audioGraph.filter.type = this.lastFilterType
  }
  if (this.model.echo.length !== this.lastEchoLength) {
    this.lastEchoLength = this.model.echo.length
    this.audioGraph.delay.delayTime.value = this.lastEchoLength
  }

  updateModelPositions(this.model)
  this.audioGraph.delayGain.gain.value = this.model.echo.sustain

  var frequency = 60 * Math.pow(8, getScaledValue(this.model.oscillator))
  this.audioGraph.oscillator.frequency.value = frequency

  var gain = getScaledValue(this.model.gain)
  this.audioGraph.oscillatorGain.gain.value = gain

  var filterFrequency = 60 * Math.pow(100, getScaledValue(this.model.filterFrequency))
  this.audioGraph.filter.frequency.value = filterFrequency

  var filterQ = this.model.filterQ.multiplier * getScaledValue(this.model.filterQ)
  this.audioGraph.filter.Q.value = filterQ
}

module.exports = AudioGraphControl
