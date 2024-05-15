const createModel = require("./create-model");
const createAudioGraph = require("./create-audio-graph");
const AudioGraphControl = require("./AudioGraphControl");
const CanvasControl = require("./CanvasControl");
const connectListeners = require("./connect-listeners");
const initialiseValues = require("./initialise-values");

window.onload = function () {
  const model = createModel();
  const audioGraph = createAudioGraph();
  const graphControl = new AudioGraphControl(audioGraph, model);
  const canvasControl = new CanvasControl(model, () => {
    graphControl.start().then(() => {
      setInterval(function () {
        graphControl.update();
        canvasControl.update();
      }, 40);
    });
  });

  initialiseValues(audioGraph, model);
  connectListeners(model);
};
