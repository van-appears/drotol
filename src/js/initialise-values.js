module.exports = function initialiseValues(audioGraph, model) {
  audioGraph.oscillator1.type = model.oscillator1Frequency.type;
  audioGraph.oscillator2.type = model.oscillator2Frequency.type;

  const lfoOnOff = document.querySelector("#lfoOnOff");
  lfoOnOff.checked = model.oscillator1Frequency.lfo;

  const echoEnabled = document.querySelector("#echoOnOff");
  echoEnabled.checked = model.echo.enabled;

  const echoLength = document.querySelector("#echoLength");
  echoLength.value = model.echo.length;
  audioGraph.delay.delayTime.value = model.echo.length;

  const echoSustain = document.querySelector("#echoSustain");
  echoSustain.value = model.echo.sustain;
  audioGraph.delayGain.gain.value = model.echo.sustain;
};
