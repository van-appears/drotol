(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function updateModelPosition (block) {
  block.dataPos += block.dataSpeed
  if (block.dataPos >= 128) {
    block.dataPos -= 128
  }
}

function updateModelPositions (model) {
  updateModelPosition(model.oscillator)
  updateModelPosition(model.gain)
  updateModelPosition(model.filterFrequency)
  updateModelPosition(model.filterQ)
}

function getScaledValue (block) {
  return (254.0 - block.data[Math.floor(block.dataPos)]) / 254.0
}

function AudioGraphControl (audioGraph, model) {
  this.model = model
  this.audioGraph = audioGraph
  this.lastOscillatorType = audioGraph.oscillator.type
  this.lastFilterType = audioGraph.filter.type
  this.lastEchoLength = audioGraph.delay.delayTime.value
}

AudioGraphControl.prototype.update = function () {
  if (this.model.oscillator.type !== this.lastOscillatorType) {
    this.lastOscillatorType = this.model.oscillator.type
    this.audioGraph.oscillator.type = this.lastOscillatorType
  }
  if (this.model.filterFrequency.type !== this.lastFilterType) {
    this.lastFilterType = this.model.filterFrequency.type
    this.audioGraph.filter.type = this.lastFilterType
  }
  if (this.model.echo.length !== this.lastEchoLength) {
    this.lastEchoLength = this.model.echo.length
    this.audioGraph.delay.delayTime.value = this.lastEchoLength
  }

  updateModelPositions(this.model)
  this.audioGraph.delayGain.gain.value = this.model.echo.sustain

  var frequency = 60 * Math.pow(8, getScaledValue(this.model.oscillator))
  this.audioGraph.oscillator.frequency.value = frequency

  var gain = getScaledValue(this.model.gain)
  this.audioGraph.oscillatorGain.gain.value = gain

  var filterFrequency = 60 * Math.pow(100, getScaledValue(this.model.filterFrequency))
  this.audioGraph.filter.frequency.value = filterFrequency

  var filterQ = this.model.filterQ.multiplier * getScaledValue(this.model.filterQ)
  this.audioGraph.filter.Q.value = filterQ
}

module.exports = AudioGraphControl

},{}],2:[function(require,module,exports){
var canvas = document.querySelector('#draw')
var canvasLeft = canvas.offsetLeft
var canvasTop = canvas.offsetTop
var context = canvas.getContext('2d')
var lastX = 0
var lastY = 0
var isStarted = false
var isDragging = false

function resetCanvas () {
  context.fillStyle = '#e6e6e6'
  context.fillRect(0, 0, 255, 255)
  context.beginPath()
  context.lineWidth = 1.0
  context.strokeStyle = '#ddd'
  context.moveTo(0, 128)
  context.lineTo(255, 128)
  context.stroke()
  context.closePath()
}

function renderData (data) {
  context.beginPath()
  context.strokeStyle = '#999'
  for (let i = 0; i < 128; i++) {
    const v1 = data[i]
    const v2 = data[i + 1]
    context.moveTo(i * 2, v1)
    context.lineTo((i + 1) * 2, v2)
  }
  context.stroke()
  context.closePath()
}

function renderPlayline (dataPos) {
  context.beginPath()
  context.strokeStyle = '#090'
  context.moveTo(dataPos * 2, 0)
  context.lineTo(dataPos * 2, 255)
  context.stroke()
  context.closePath()
}

function setRange (data, startX, startY, endX, endY) {
  var dist = (endY - startY) / (endX - startX)
  if (startX < endX) {
    for (let i = startX; i <= endX; i++) {
      data[i] = startY
      startY += dist
    }
  } else {
    for (let i = startX; i >= endX; i--) {
      data[i] = startY
      startY -= dist
    }
  }
}

function asX (mouseEvt) {
  return Math.floor((mouseEvt.pageX - canvasLeft) / 2)
}

function CanvasControl (model) {
  this.model = model
  canvas.addEventListener('mousedown', this.mouseDown.bind(this))
  canvas.addEventListener('mousemove', this.mouseMove.bind(this))
  canvas.addEventListener('mouseout', this.mouseUp.bind(this))
  canvas.addEventListener('mouseup', this.mouseUp.bind(this))
}

CanvasControl.prototype.update = function () {
  var active = this.model[this.model.active]
  this.data = active && active.data
  this.updated = false
  resetCanvas()
  if (!this.data) return
  renderData(this.data)
  renderPlayline(active && active.dataPos)
}

CanvasControl.prototype.mouseDown = function (mouseEvt) {
  if (!this.data) return
  lastX = asX(mouseEvt)
  lastY = mouseEvt.pageY - canvasTop
  this.data[ lastX ] = lastY
  isStarted = true
}

CanvasControl.prototype.mouseUp = function (mouseEvt) {
  if (!this.data) return
  var toX = asX(mouseEvt)
  var toY = mouseEvt.pageY - canvasTop
  if (isDragging) {
    setRange(this.data, lastX, lastY, toX, toY)
  } else if (isStarted) {
    this.data[ toX ] = toY
  }
  isStarted = false
  isDragging = false
  lastX = null
  lastY = null
}

CanvasControl.prototype.mouseMove = function (mouseEvt) {
  if (!this.data || this.updated) {
    return
  }
  if (isStarted) {
    var toX = asX(mouseEvt)
    var toY = mouseEvt.pageY - canvasTop
    setRange(this.data, lastX, lastY, toX, toY)
    this.updated = true
    isDragging = true
    lastX = toX
    lastY = toY
  }
}

module.exports = CanvasControl

},{}],3:[function(require,module,exports){
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

var flop = false
setInterval(function () {
  graphControl.update()
  if (flop) {
    canvasControl.update()
  }
  flop = !flop
}, 20)

},{"./AudioGraphControl":1,"./CanvasControl":2,"./connect-listeners":4,"./create-audio-graph":5,"./create-model":6}],4:[function(require,module,exports){
var speed = document.querySelector('#speed')
var filterType = document.querySelector('#filterType')
var oscillatorType = document.querySelector('#oscillatorType')
var echoLength = document.querySelector('#echoLength')
var echoSustain = document.querySelector('#echoSustain')
var model = {}
var active = {}

function radioClick (evt) {
  var selected = evt.target.value
  var what = document.querySelector('.what')
  document.querySelector('body').className = 'selected_' + selected

  model.active = selected
  active = model[selected]
  if (active) {
    speed.value = (Math.log(active.dataSpeed) / Math.log(2)) + 2
    what.innerHTML = active.label
  }
}

function speedChange (evt) {
  active.dataSpeed = Math.pow(2, evt.target.value - 2)
}

function echoLengthChange (evt) {
  active.length = evt.target.value
}

function echoSustainChange (evt) {
  active.sustain = evt.target.value
}

function filterTypeChange (evt) {
  var selected = evt.target.value
  model.filterFrequency.type = selected
  switch (selected) {
    case 'notch':
    case 'bandpass':
      model.filterQ.multiplier = 30
      model.filterQ.label = 'Filter bandwidth'
      break
    default:
      model.filterQ.multiplier = 1
      model.filterQ.label = 'Filter resonance'
  }
}

function oscillatorTypeChange (evt) {
  model.oscillator.type = evt.target.value
}

module.exports = function connectListeners (_model) {
  model = _model
  active = model[model.active]

  speed.value = active.dataSpeed
  speed.addEventListener('input', speedChange)

  echoLength.value = model.echo.length
  echoLength.addEventListener('change', echoLengthChange)

  echoSustain.value = model.echo.sustain
  echoSustain.addEventListener('input', echoSustainChange)

  filterType.value = model.filterFrequency.type
  filterType.addEventListener('change', filterTypeChange)

  oscillatorType.value = model.oscillator.type
  oscillatorType.addEventListener('change', oscillatorTypeChange)

  var radios = document.querySelectorAll('input[name="box"]')
  for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = radioClick
  }
  radios[0].click()
}

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
function modelBlock (additional) {
  var arr = new Array(128)
  for (var i = 0; i < 128; i++) {
    arr[i] = 128
  }
  var block = {
    data: arr,
    dataPos: 0,
    dataSpeed: 0.25
  }
  additional = additional || {}
  for (var key in additional) {
    if (Object.prototype.hasOwnProperty.call(additional, key)) {
      block[key] = additional[key]
    }
  }
  return block
}

module.exports = function createModel () {
  return {
    active: 'oscillator',
    oscillator: modelBlock({
      label: 'Frequency',
      type: 'triangle'
    }),
    gain: modelBlock({
      label: 'Gain'
    }),
    filterFrequency: modelBlock({
      label: 'Filter frequency',
      type: 'allpass'
    }),
    filterQ: modelBlock({
      label: 'Filter resonance',
      multiplier: 1
    }),
    echo: {
      label: 'Echo',
      length: 0.1,
      sustain: 0.5
    }
  }
}

},{}]},{},[3]);
