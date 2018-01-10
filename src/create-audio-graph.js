var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

var oscillator = audioCtx.createOscillator()
var oscillatorGain = audioCtx.createGain()
var filter = audioCtx.createBiquadFilter()
var delay = audioCtx.createDelay()
var delayGain = audioCtx.createGain()

oscillator.connect(oscillatorGain)
oscillatorGain.connect(filter)
filter.connect(audioCtx.destination)
filter.connect(delay)
delay.connect(delayGain)
delayGain.connect(audioCtx.destination)
delayGain.connect(delay)
oscillator.start()

module.exports = function createAudioGraph (model) {
  oscillator.type = model.oscillator.type
  filter.type = model.filterFrequency.type
  delay.delayTime.value = model.echo.length
  delayGain.gain.value = model.echo.sustain

  return {
    oscillator: oscillator,
    oscillatorGain: oscillatorGain,
    filter: filter,
    delay: delay,
    delayGain: delayGain
  }
}
