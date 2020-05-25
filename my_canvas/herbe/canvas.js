//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const colors = ["#6C7780", "#8CC9FF", "#DAEEFF", "#466580", "#ADBECC"]
const randomColor = () => {
  const index = randomInt(0, 4)
  return colors[index]
}

const getDistance = (x1, y1, x2, y2) => {
  const xDistance = x2 - x1
  const yDistance = y2 - y1
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

//CANVAS
const canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const c = canvas.getContext("2d")

//WINDOW
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  init()
})

//MOUSE
let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

//OBJECT

function Herbe(x, y, height, baseWidth, startRad, colorFill, colorStroke) {
  this.x = x
  this.y = y
  this.height = height
  this.baseWidth = baseWidth
  this.colorFill = colorFill
  this.colorStroke = colorStroke
  this.xEndVar = 0
  this.xCtrlTopVar = 0
  this.xCtrlMidVar = 0
  this.radEnd = startRad
  this.radTop = startRad
  this.radMid = startRad + Math.PI / 3

  this.update = () => {
    this.xCtrlTopVar += Math.cos(this.radMid) * 2
    this.xCtrlMidVar += Math.cos(this.radMid) * 2
    this.xEndVar += Math.cos(this.radEnd) * 4
    this.radMid += Math.PI / 20
    this.radEnd += Math.PI / 20
    this.draw()
  }
  this.draw = () => {
    const ctrlMid = { x: this.x + this.xCtrlMidVar, y: this.y - this.height / 4 }
    const ctrlTop = { x: this.x + this.xCtrlTopVar, y: this.y - this.height / 2 }
    const end = { x: this.x + this.xEndVar, y: this.y - this.height }
    const width2 = this.baseWidth / 2
    const width4 = this.baseWidth / 4
    c.fillStyle = this.colorFill
    c.strokeStyle = this.colorStroke
    c.lineWidth = 2
    c.beginPath()
    //BASE
    c.moveTo(this.x - width2, this.y)
    c.lineTo(this.x + width2, this.y)
    //DROITE
    c.bezierCurveTo(ctrlMid.x + width2, ctrlMid.y, ctrlTop.x + width4, ctrlTop.y, end.x, end.y)
    //GAUCHE
    c.bezierCurveTo(ctrlTop.x - width4, ctrlTop.y, ctrlMid.x - width2, ctrlMid.y, this.x - width2, this.y)
    c.fill()
    //MILIEU
    c.moveTo(this.x, this.y)
    c.bezierCurveTo(ctrlMid.x, ctrlMid.y, ctrlTop.x, ctrlTop.y, end.x, end.y)

    c.stroke()
  }
}

//IMPLEMENTATION

let herbes
const init = () => {
  herbes = []
  const baseWidth = 20
  for (let i = 0; i < innerWidth * 2; i += baseWidth / 2) {
    const height = randomInt(150, 250)
    const startRad = Math.random() * Math.PI
    herbes.push(new Herbe(i, canvas.height, height, baseWidth, startRad, "#14452D", "#268557"))
  }
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  herbes.forEach((h) => h.update())
}

init()
animate()
