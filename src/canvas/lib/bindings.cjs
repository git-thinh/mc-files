'use strict'

var bindings;
if (process.platform === "win32") bindings = require('../build/win32/canvas.node')
else bindings = require('../build/linux/canvas.node')
//console.log('bindings =', process.platform, bindings);

module.exports = bindings

Object.defineProperty(bindings.Canvas.prototype, Symbol.toStringTag, {
  value: 'HTMLCanvasElement',
  configurable: true
})

Object.defineProperty(bindings.Image.prototype, Symbol.toStringTag, {
  value: 'HTMLImageElement',
  configurable: true
})

bindings.ImageData.prototype.toString = function () {
	return '[object ImageData]'
}

Object.defineProperty(bindings.ImageData.prototype, Symbol.toStringTag, {
  value: 'ImageData',
  configurable: true
})

bindings.CanvasGradient.prototype.toString = function () {
	return '[object CanvasGradient]'
}

Object.defineProperty(bindings.CanvasGradient.prototype, Symbol.toStringTag, {
  value: 'CanvasGradient',
  configurable: true
})

Object.defineProperty(bindings.CanvasPattern.prototype, Symbol.toStringTag, {
  value: 'CanvasPattern',
  configurable: true
})

Object.defineProperty(bindings.CanvasRenderingContext2d.prototype, Symbol.toStringTag, {
  value: 'CanvasRenderingContext2d',
  configurable: true
})
