var createModel = require('./create-model')
var createAudioGraph = require('./create-audio-graph')
var AudioGraphControl = require('./AudioGraphControl')
var CanvasControl = require('./CanvasControl')
var connectListeners = require('./connect-listeners')

var model = createModel()
var audioGraph = createAudioGraph(model)
var graphControl = new AudioGraphControl(audioGraph, model)
var canvasControl = new CanvasControl(model)
connectListeners(model)

setInterval(function () {
  graphControl.update()
  canvasControl.update()
}, 20)
