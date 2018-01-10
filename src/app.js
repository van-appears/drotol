var createModel = require('./create-model')
var createAudioGraph = require('./create-audio-graph')
var audioGraphControl = require('./audio-graph-control')
var CanvasControl = require('./CanvasControl')
var connectListeners = require('./connect-listeners')

var model = createModel()
var audioGraph = createAudioGraph(model)
var graphUpdater = audioGraphControl(audioGraph, model)
var canvasControl = new CanvasControl(model)
connectListeners(model)

setInterval(function () {
  graphUpdater()
  canvasControl.refresh()
}, 20)
