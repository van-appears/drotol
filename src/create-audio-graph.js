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

module.exports = function createAudioGraph () {
  return {
    oscillator1: oscillator1,
    oscillator2: oscillator2,
    oscillatorGain: oscillatorGain,
    filter: filter,
    delay: delay,
    delayGain: delayGain
  }
}
