function updateModelPosition (block) {
  block.dataPos += block.dataSpeed
  if (block.dataPos >= 128) {
    block.dataPos -= 128
  }
}

function updateModelPositions (model) {
  updateModelPosition(model.oscillator1Frequency)
  updateModelPosition(model.oscillator2Frequency)
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
  this.lastOscillator1Type = audioGraph.oscillator1.type
  this.lastOscillator2Type = audioGraph.oscillator2.type
  this.lastFilterType = audioGraph.filter.type
  this.lastEchoLength = audioGraph.delay.delayTime.value
}

AudioGraphControl.prototype.start = function () {
  this.audioGraph.oscillator1.start()
  this.audioGraph.oscillator2.start()
}

AudioGraphControl.prototype.update = function () {
  if (this.model.oscillator1Frequency.type !== this.lastOscillator1Type) {
    this.lastOscillator1Type = this.model.oscillator1Frequency.type
    this.audioGraph.oscillator1.type = this.lastOscillator1Type
  }
  if (this.model.oscillator2Frequency.type !== this.lastOscillator2Type) {
    this.lastOscillator2Type = this.model.oscillator2Frequency.type
    this.audioGraph.oscillator2.type = this.lastOscillator2Type
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
  this.audioGraph.delayGain.gain.value = this.model.echo.enabled
    ? this.model.echo.sustain
    : 0

  var frequency1 = 60 * Math.pow(8, getScaledValue(this.model.oscillator1Frequency))
  this.audioGraph.oscillator1.frequency.value = frequency1

  var frequency2 = 60 * Math.pow(8, getScaledValue(this.model.oscillator2Frequency))
  this.audioGraph.oscillator2.frequency.value = frequency2

  var gain = getScaledValue(this.model.gain)
  this.audioGraph.oscillatorGain.gain.value = gain

  var filterFrequency = 60 * Math.pow(100, getScaledValue(this.model.filterFrequency))
  this.audioGraph.filter.frequency.value = filterFrequency

  var filterQ = this.model.filterQ.multiplier * getScaledValue(this.model.filterQ)
  this.audioGraph.filter.Q.value = filterQ
}

module.exports = AudioGraphControl
