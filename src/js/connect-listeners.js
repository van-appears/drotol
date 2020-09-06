module.exports = function connectListeners(model) {
  const speed = document.querySelector("#speed");
  const filterType = document.querySelector("#filterType");
  const echoEnabled = document.querySelector("#echoOnOff");
  const echoLength = document.querySelector("#echoLength");
  const echoSustain = document.querySelector("#echoSustain");
  const lfoEnabled = document.querySelector("#lfoOnOff");
  const activeControlLabel = document.querySelector(".what");
  const body = document.querySelector("body");
  let active = model[model.active];

  function setLabel(label, attr) {
    activeControlLabel.innerHTML = label;
  }

  function selectOscillatorType(type) {
    document
      .querySelector('input[name="oscillatorType"][value="' + type + '"]')
      .click();
  }

  function radioClick(evt) {
    const selected = evt.target.value;
    body.className = "selected_" + selected;
    model.active = selected;
    active = model[selected];

    setLabel(active.label, active.type);
    speed.value = Math.log(active.dataSpeed) / Math.log(2);
    if (selected === "oscillator1Frequency") {
      selectOscillatorType(model.oscillator1Frequency.type);
      lfoEnabled.checked = model.oscillator1Frequency.lfoEnabled;
    } else if (selected === "oscillator2Frequency") {
      selectOscillatorType(model.oscillator2Frequency.type);
      lfoEnabled.checked = model.oscillator2Frequency.lfoEnabled;
    }
  }

  function speedChange(evt) {
    active.dataSpeed = Math.pow(2, evt.target.value);
  }

  function echoLengthChange(evt) {
    active.length = evt.target.value;
  }

  function echoSustainChange(evt) {
    active.sustain = evt.target.value;
  }

  function echoEnabledChange(evt) {
    active.enabled = evt.target.checked;
  }

  function lfoEnabledChange(evt) {
    active.lfoEnabled = evt.target.checked;
  }

  function filterTypeChange(evt) {
    const selected = evt.target.value;
    model.filterFrequency.type = selected;
    setLabel(active.label, model.filterFrequency.type);

    switch (selected) {
      case "notch":
      case "bandpass":
        model.filterQ.multiplier = 30;
        model.filterQ.label = "Filter bandwidth";
        break;
      default:
        model.filterQ.multiplier = 20;
        model.filterQ.label = "Filter resonance";
    }
  }

  function oscillatorTypeChange(evt) {
    active.type = evt.target.value;
  }

  speed.addEventListener("input", speedChange);
  echoLength.addEventListener("change", echoLengthChange);
  echoSustain.addEventListener("input", echoSustainChange);
  echoEnabled.addEventListener("change", echoEnabledChange);
  lfoEnabled.addEventListener("change", lfoEnabledChange);

  const radios = document.querySelectorAll('input[name="box"]');
  for (let i = 0; i < radios.length; i++) {
    radios[i].onclick = radioClick;
  }
  radios[0].click();

  const filterTypeRadios = document.querySelectorAll(
    'input[name="filterType"]'
  );
  for (let i = 0; i < filterTypeRadios.length; i++) {
    filterTypeRadios[i].onclick = filterTypeChange;
  }
  filterTypeRadios[0].click();

  const oscillatorTypeRadios = document.querySelectorAll(
    'input[name="oscillatorType"]'
  );
  for (let i = 0; i < oscillatorTypeRadios.length; i++) {
    oscillatorTypeRadios[i].onclick = oscillatorTypeChange;
  }
  oscillatorTypeRadios[0].click();
};
