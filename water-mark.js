(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof module === 'object') {
    module.exports = factory
  } else {
    root.watermark = factory()
  }
})(this, function () {
  class WaterMark {
    constructor (options) {
      const defaultOptions = {
        fontSize: 14,
        fontFamily: 'YaHei',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        angle: 0,
        padding: 0,
        color: '#333',
        opcity: 1,
        observer: true
      }
      this.options = Object.assign(defaultOptions, options)
      this.ctx = null
      this.url = null
      this.img = null
    }

    // 获取文字宽高
    getRect () {
      const { padding, fontSize, fontFamily, text, angle } = this.options
      const textCanvas = document.createElement('canvas')
      const textCtx = textCanvas.getContext('2d')
      textCtx.font = `${fontSize}px ${fontFamily}`
      const { width } = textCtx.measureText(text)
      const height = fontSize * 1.5
      const clientWidth = Math.abs(width * Math.cos(Math.PI * angle / 180)) + (padding[4] || padding[2] || padding[1] || padding || 0) + (padding[2] || padding[1] || padding || 0)
      const clientHeight = Math.abs(width * Math.sin(Math.PI * angle / 180) + height) + (padding[3] || padding[1] || padding || 0) + (padding[1] || padding || 0)
      return {
        clientWidth,
        clientHeight
      }
    }

    // 开始绘制
    startDraw () {
      const { width, height, left, top, bottom, right, fontSize, fontFamily, color, opacity, angle, text } = this.options
      const { clientWidth, clientHeight } = this.getRect()
      const canvas = document.createElement('canvas')
      canvas.width = width || document.body.clientWidth - left - right - 1
      canvas.height = height || document.body.clientHeight - top - bottom - 1
      const col = Math.ceil(canvas.width / clientWidth)
      const row = Math.ceil(canvas.height / clientHeight)
      const ctx = canvas.getContext('2d')
      this.ctx = ctx
      ctx.font = `${fontSize}px ${fontFamily}`
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      for (let i = 0; i < col * row; i++) {
        ctx.save()
        ctx.translate(((i % col) * clientWidth) + clientWidth / 2, (Math.floor(i / col) * clientHeight) + clientHeight / 2)
        ctx.rotate(angle * Math.PI / 180)
        ctx.fillText(text, -clientWidth / 2, 0)
        ctx.restore()
      }
      const url = canvas.toDataURL('image/jpg')
      this.url = url
    }

    // 往页面添加图片
    appendDom () {
      const { left, right, top, bottom } = this.options
      const img = document.createElement('img')
      img.setAttribute('style', `position: absolute;z-index: 999; left: ${left || 0}px; right: ${right || 0}px; top: ${top || 0}px; bottom: ${bottom || 0}px; pointer-events: none;`)
      img.setAttribute('src', this.url)
      document.body.appendChild(img)
      this.img = img
    }

    // 初始化
    init () {
      this.startDraw()
      this.appendDom()
      if (this.options.observer) {
        this.oberver()
      }
    }

    // 更新URL
    updateUrl () {
      this.img.setAttribute('src', this.url)
    }

    // 清空画布
    clear () {
      this.ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight)
    }

    // 重新绘制
    resize () {
      this.clear()
      this.startDraw()
      this.updateUrl()
    }

    // 监听元素变化，防止篡改
    oberver () {
      const oberver = new MutationObserver((mutationsList, oberver) => {
        mutationsList.forEach(mutations => {
          const { type, attributeName, target: { src = '' } } = mutations
          if (type === 'attributes' && attributeName === 'src') {
            if (src !== this.url) {
              window.location.reload()
            }
          } else {
            window.location.reload()
          }
        })
      })
      oberver.observe(this.img, {
        attributes: true
      })
    }
  }
  return (options) => {
    const watermark = new WaterMark(options)
    watermark.init()
    window.addEventListener('resize', () => {
      watermark.resize()
    })
  }
})
