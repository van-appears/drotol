function updateModelPosition(block) {
  block.dataPos += block.dataSpeed;
  if (block.dataPos >= 128) {
    block.dataPos -= 128;
  }
}

function updateModelPositions(model) {
  updateModelPosition(model.oscillator1Frequency);
  updateModelPosition(model.oscillator2Frequency);
  updateModelPosition(model.gain);
  updateModelPosition(model.filterFrequency);
  updateModelPosition(model.filterQ);
}

function getScaledValue(block) {
  return (254.0 - block.data[Math.floor(block.dataPos)]) / 254.0;
}

function getFrequency(block) {
  if (block.lfoEnabled) {
    return 0.2 * Math.pow(16, getScaledValue(block));
  }
  return 60 * Math.pow(8, getScaledValue(block));
}

function AudioGraphControl(audioGraph, model) {
  this.model = model;
  this.audioGraph = audioGraph;
  this.lastOscillator1Type = audioGraph.oscillator1.type;
  this.lastOscillator2Type = audioGraph.oscillator2.type;
  this.lastFilterType = audioGraph.filter.type;
  this.lastEchoLength = audioGraph.delay.delayTime.value;
}

AudioGraphControl.prototype.start = function () {
  return this.audioGraph.audioCtx.resume().then(() => {
    this.audioGraph.oscillator1.start(0);
    this.audioGraph.oscillator2.start(0);
  });
};

AudioGraphControl.prototype.update = function () {
  if (this.model.oscillator1Frequency.type !== this.lastOscillator1Type) {
    this.lastOscillator1Type = this.model.oscillator1Frequency.type;
    this.audioGraph.oscillator1.type = this.lastOscillator1Type;
  }
  if (this.model.oscillator2Frequency.type !== this.lastOscillator2Type) {
    this.lastOscillator2Type = this.model.oscillator2Frequency.type;
    this.audioGraph.oscillator2.type = this.lastOscillator2Type;
  }
  if (this.model.filterFrequency.type !== this.lastFilterType) {
    this.lastFilterType = this.model.filterFrequency.type;
    this.audioGraph.filter.type = this.lastFilterType;
  }
  if (this.model.echo.length !== this.lastEchoLength) {
    this.lastEchoLength = this.model.echo.length;
    this.audioGraph.delay.delayTime.setTargetAtTime(this.lastEchoLength, 0, 0);
  }

  updateModelPositions(this.model);
  this.audioGraph.delayGain.gain.setTargetAtTime
    (this.model.echo.enabled ? this.model.echo.sustain : 0, 0, 0);

  const frequency1 = getFrequency(this.model.oscillator1Frequency);
  this.audioGraph.oscillator1.frequency.setTargetAtTime(frequency1, 0, 0);

  const frequency2 = getFrequency(this.model.oscillator2Frequency);
  this.audioGraph.oscillator2.frequency.setTargetAtTime(frequency2, 0, 0);

  const gain = getScaledValue(this.model.gain);
  this.audioGraph.oscillatorGain.gain.setTargetAtTime(gain, 0, 0);

  const filterFrequency =
    60 * Math.pow(100, getScaledValue(this.model.filterFrequency));
  this.audioGraph.filter.frequency.setTargetAtTime(filterFrequency, 0, 0);

  const filterQ =
    this.model.filterQ.multiplier * getScaledValue(this.model.filterQ);
  this.audioGraph.filter.Q.setTargetAtTime(filterQ, 0, 0);
};

module.exports = AudioGraphControl;
