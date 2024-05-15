const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const oscillator1 = audioCtx.createOscillator();
const oscillator2 = audioCtx.createOscillator();
const ringMod = audioCtx.createGain();
const oscillatorGain = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
const delay = audioCtx.createDelay();
const delayGain = audioCtx.createGain();

oscillator1.connect(ringMod);
oscillator2.connect(ringMod.gain);
ringMod.connect(oscillatorGain);
oscillatorGain.connect(filter);
filter.connect(audioCtx.destination);
filter.connect(delay);
delay.connect(delayGain);
delayGain.connect(audioCtx.destination);
delayGain.connect(delay);

module.exports = function createAudioGraph() {
  return {
    audioCtx: audioCtx,
    oscillator1: oscillator1,
    oscillator2: oscillator2,
    oscillatorGain: oscillatorGain,
    filter: filter,
    delay: delay,
    delayGain: delayGain,
  };
};
