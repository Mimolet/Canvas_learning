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

function Object(x, y, radius, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color

  this.update = () => {
    this.draw()
  }
  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }
}

//IMPLEMENTATION

const init = () => {
  c.lineWidth = 4
  c.lineJoin = "round"
  c.fillStyle = "white"
  c.strokeStyle = "white"
  c.beginPath()
  const xCtrl = innerWidth / 2 + 50
  const yCtrl = innerHeight - 100
  c.moveTo(innerWidth / 2, innerHeight)
  c.quadraticCurveTo(xCtrl, yCtrl, innerWidth / 2, innerHeight - 500)
  c.quadraticCurveTo(xCtrl, yCtrl, innerWidth / 2 + 50, innerHeight)
  c.stroke()
  c.fill()
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
}

init()
// animate()
