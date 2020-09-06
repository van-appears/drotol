function canvasFields() {
  const arr = new Array(128);
  for (let i = 0; i < 128; i++) {
    arr[i] = 128;
  }
  return {
    data: arr,
    dataPos: 0,
    dataSpeed: 0.5,
  };
}

function extend(obj, additional) {
  for (let key in additional) {
    if (Object.prototype.hasOwnProperty.call(additional, key)) {
      obj[key] = additional[key];
    }
  }
  return obj;
}

module.exports = function createModel() {
  return {
    active: "oscillator1Frequency",
    oscillator1Frequency: extend(
      {
        label: "Frequency",
        type: "triangle",
        lfo: false,
      },
      canvasFields()
    ),
    oscillator2Frequency: extend(
      {
        label: "Frequency",
        type: "triangle",
        lfo: false,
      },
      canvasFields()
    ),
    gain: extend(
      {
        label: "Gain",
      },
      canvasFields()
    ),
    filterFrequency: extend(
      {
        label: "Filter frequency",
        type: "allpass",
      },
      canvasFields()
    ),
    filterQ: extend(
      {
        label: "Filter resonance",
        multiplier: 1,
      },
      canvasFields()
    ),
    echo: {
      label: "Echo",
      length: 0.1,
      sustain: 0.5,
      enabled: true,
    },
  };
};
