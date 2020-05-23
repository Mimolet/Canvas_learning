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

function Herbe(x, y, height, baseWidth, colorFill, colorStroke) {
  this.x = x
  this.y = y
  this.height = height
  this.baseWidth = baseWidth
  this.colorFill = colorFill
  this.colorStroke = colorStroke
  this.xEndVar = randomInt(-50, 50)
  this.xCtrlTopVar = randomInt(-20, 20)
  this.xCtrlMidVar = randomInt(-50, 50)

  this.update = () => {
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

let herbe
const init = () => {
  herbe = new Herbe(canvas.width / 2, canvas.height, 300, 30, "#852019", "#D13228")
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  herbe.update()
}

init()
animate()
