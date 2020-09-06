const layersRect = document.querySelector(".layers").getBoundingClientRect();
const canvas = document.querySelector("#draw");
const context = canvas.getContext("2d");
context.lineWidth = 1.0;

let layersLeft = 0;
let layersTop = 0;
let lastX = 0;
let lastY = 0;
let isStarted = false;
let isDragging = false;

function renderCentreLine() {
  const bgCanvas = document.querySelector("#bg");
  const bgContext = canvas.getContext("2d");
  bgContext.beginPath();
  bgContext.strokeStyle = "#ddd";
  bgContext.lineWidth = 1.0;
  bgContext.moveTo(0, 128);
  bgContext.lineTo(255, 128);
  bgContext.stroke();
  bgContext.closePath();
}

function renderData(data) {
  context.clearRect(0, 0, 255, 255);
  context.beginPath();
  context.strokeStyle = "#999";
  let v1 = data[0];
  context.moveTo(0, v1);
  for (let i = 1; i < 128; i++) {
    const v2 = data[i];
    context.lineTo(i * 2, v2);
    v1 = v2;
  }
  context.stroke();
  context.closePath();
}

function renderPlayline(dataPos) {
  context.beginPath();
  context.strokeStyle = "#090";
  context.moveTo(dataPos * 2, 0);
  context.lineTo(dataPos * 2, 255);
  context.stroke();
  context.closePath();
}

function setRange(data, startX, startY, endX, endY) {
  const dist = (endY - startY) / (endX - startX);
  if (startX < endX) {
    for (let i = startX; i <= endX; i++) {
      data[i] = startY;
      startY += dist;
    }
  } else {
    for (let i = startX; i >= endX; i--) {
      data[i] = startY;
      startY -= dist;
    }
  }
}

function asX(evt) {
  const useEvent = evt.changedTouches ? evt.changedTouches[0] : evt;
  return Math.floor((useEvent.pageX - layersLeft) / 2);
}

function asY(evt) {
  const useEvent = evt.changedTouches ? evt.changedTouches[0] : evt;
  return useEvent.pageY - layersTop;
}

function CanvasControl(model) {
  this.model = model;
  canvas.addEventListener("mousedown", this.mouseDown.bind(this));
  canvas.addEventListener("mousemove", this.mouseMove.bind(this));
  canvas.addEventListener("mouseout", this.mouseUp.bind(this));
  canvas.addEventListener("mouseup", this.mouseUp.bind(this));
  canvas.addEventListener("touchstart", this.mouseDown.bind(this));
  canvas.addEventListener("touchmove", this.mouseMove.bind(this));
  canvas.addEventListener("touchend", this.mouseUp.bind(this));
  canvas.addEventListener("touchcancel", this.mouseUp.bind(this));
  renderCentreLine();

  const layersRect = document.querySelector(".layers").getBoundingClientRect();
  layersLeft = layersRect.left;
  layersTop = layersRect.top;
}

CanvasControl.prototype.update = function () {
  const active = this.model[this.model.active];
  this.data = active && active.data;
  this.updated = false;
  if (!this.data) return;
  renderData(this.data);
  renderPlayline(active && active.dataPos);
};

CanvasControl.prototype.mouseDown = function (mouseEvt) {
  if (!this.data) return;
  lastX = asX(mouseEvt);
  lastY = asY(mouseEvt);
  this.data[lastX] = lastY;
  isStarted = true;
};

CanvasControl.prototype.mouseUp = function (mouseEvt) {
  if (!this.data) return;
  const toX = asX(mouseEvt);
  const toY = asY(mouseEvt);
  if (isDragging) {
    setRange(this.data, lastX, lastY, toX, toY);
  } else if (isStarted) {
    this.data[toX] = toY;
  }
  isStarted = false;
  isDragging = false;
  lastX = null;
  lastY = null;
};

CanvasControl.prototype.mouseMove = function (mouseEvt) {
  if (!this.data || this.updated) {
    return;
  }
  if (isStarted) {
    const toX = asX(mouseEvt);
    const toY = asY(mouseEvt);
    setRange(this.data, lastX, lastY, toX, toY);
    this.updated = true;
    isDragging = true;
    lastX = toX;
    lastY = toY;
  }
};

module.exports = CanvasControl;
