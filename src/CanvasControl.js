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

function asX (evt) {
  var useEvent = evt.changedTouches
    ? evt.changedTouches[ 0 ]
    : evt
  return Math.floor((useEvent.pageX - canvasLeft) / 2)
}

function asY (evt) {
  var useEvent = evt.changedTouches
    ? evt.changedTouches[ 0 ]
    : evt
  return useEvent.pageY - canvasTop
}

function CanvasControl (model) {
  this.model = model
  canvas.addEventListener('mousedown', this.mouseDown.bind(this))
  canvas.addEventListener('mousemove', this.mouseMove.bind(this))
  canvas.addEventListener('mouseout', this.mouseUp.bind(this))
  canvas.addEventListener('mouseup', this.mouseUp.bind(this))
  canvas.addEventListener('touchstart', this.mouseDown.bind(this))
  canvas.addEventListener('touchmove', this.mouseMove.bind(this))
  canvas.addEventListener('touchend', this.mouseUp.bind(this))
  canvas.addEventListener('touchcancel', this.mouseUp.bind(this))
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
  lastY = asY(mouseEvt)
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
    var toY = asY(mouseEvt)
    setRange(this.data, lastX, lastY, toX, toY)
    this.updated = true
    isDragging = true
    lastX = toX
    lastY = toY
  }
}

module.exports = CanvasControl
