var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

var oscillator1 = audioCtx.createOscillator()
var oscillator2 = audioCtx.createOscillator()
var ringMod = audioCtx.createGain()
var oscillatorGain = audioCtx.createGain()
var filter = audioCtx.createBiquadFilter()
var delay = audioCtx.createDelay()
var delayGain = audioCtx.createGain()

oscillator1.connect(ringMod)
oscillator2.connect(ringMod.gain)
ringMod.connect(oscillatorGain)
oscillatorGain.connect(filter)
filter.connect(audioCtx.destination)
filter.connect(delay)
delay.connect(delayGain)
delayGain.connect(audioCtx.destination)
delayGain.connect(delay)
oscillator1.start()
oscillator2.start()

module.exports = function createAudioGraph (model) {
  oscillator1.type = model.oscillator1Frequency.type
  oscillator2.type = model.oscillator2Frequency.type
  filter.type = model.filterFrequency.type
  delay.delayTime.value = model.echo.length
  delayGain.gain.value = model.echo.sustain

  return {
    oscillator1: oscillator1,
    oscillator2: oscillator2,
    oscillatorGain: oscillatorGain,
    filter: filter,
    delay: delay,
    delayGain: delayGain
  }
}
