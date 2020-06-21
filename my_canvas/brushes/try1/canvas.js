//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const colors = ["#6C7780", "#8CC9FF", "#DAEEFF", "#466580", "#ADBECC"]
const randomColor = () => {
  const index = randomInt(0, 4)
  return colors[index]
}

const randomDecim = (min, max) => {
  return Math.random() * (max - min) + min
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
let mouseDown = false
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
  if (brush && mouseDown) {
    brush.updatePosition(event.clientX, event.clientY)
    brush.draw()
  }
})

window.addEventListener("mousedown", (event) => {
  mouseDown = true
})

window.addEventListener("mouseup", (event) => {
  mouseDown = false
})

//OBJECT

function Brush(x, y, radius, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color
  this.lastPosition = { x: x, y: y }

  this.update = () => {
    this.draw()
  }

  this.updatePosition = (x, y) => {
    this.lastPosition = { x: this.x, y: this.y }
    this.x = x
    this.y = y
  }

  this.draw = () => {
    if (this.lastPosition.x !== this.x || this.lastPosition.y !== this.y) {
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = this.color
      c.fill()
      c.closePath()
    }
  }
}

//IMPLEMENTATION

let brush
const init = () => {
  brush = new Brush(mouse.x, mouse.y, 50, "white")
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
}

init()
// animate()
