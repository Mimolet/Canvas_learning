//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const colors = ["#6C7780", "#8CC9FF", "#DAEEFF", "#466580", "#ADBECC"]
const randomColor = (colorArray) => {
  const index = randomInt(0, colorArray.length - 1)
  return colorArray[index]
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
window.addEventListener("click", (event) => {
  init()
})

//OBJECT

const INIT_OPACITY = 0.7
const fireColors = ["white", "yellow", "orange", "red"]

function Flame(x, y, radius, color) {
  this.x = x
  this.y = y
  this.dx = 0
  this.dy = -(1 - INIT_OPACITY) * 10
  this.radius = radius
  this.color = color
  this.opacity = INIT_OPACITY
  this.sparks = generateSparks(this.x, this.y, this.color, 3)

  this.update = () => {
    this.x += this.dx
    this.y += this.dy
    this.dy = -(1 - this.opacity) * 10
    this.opacity += -0.02
    this.opacity = Math.max(this.opacity, 0)
    this.radius = Math.max(this.radius - 1, 0)
    this.draw()
  }
  this.draw = () => {
    const gradient = c.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.radius * 2)
    gradient.addColorStop(0, "white")
    gradient.addColorStop(0.9, this.color)
    gradient.addColorStop(0.9, "transparent")
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.save()
    c.globalAlpha = this.opacity
    c.fillStyle = gradient
    c.fill()
    c.restore()
    c.closePath()
  }
}

function Spark(x, y, radius, color) {
  this.x = x
  this.y = y
  this.dx = -2
  this.dy = -10
  this.radian = 0
  this.radius = radius
  this.color = "red"

  this.update = () => {
    this.x += this.dx
    this.y += this.dy
    this.radian += Math.PI / 6
    this.dx += this.dx + Math.cos(this.radian)
    this.dy += this.dy + Math.sin(this.radian)
    this.sparks.forEach((s) => s.update())
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

const generateSparks = (x, y, color, qty) => {
  let sparks = []
  for (let i = 0; i < qty; i++) {
    const sX = randomInt(x - 5, x + 5)
    const sY = randomInt(y - 5, y + 5)
    sparks.push(new Spark(sX, sY, 3, color))
  }
  return sparks
}

//IMPLEMENTATION

let flames = []
const init = () => {
  flames = []
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  if (flames.length < 50 && !flames.find((flame) => flame.x === mouse.x && flame.y === mouse.y)) {
    const x = randomInt(mouse.x - 5, mouse.x + 5)
    const y = randomInt(mouse.y - 5, mouse.y + 5)
    flames.push(new Flame(x, y, randomInt(15, 40), "white"))
  }
  flames.forEach((flame) => {
    flame.update()
    if (flame.opacity <= 0) {
      flame.x = randomInt(mouse.x - 5, mouse.x + 5)
      flame.y = randomInt(mouse.y - 5, mouse.y + 5)
      flame.opacity = INIT_OPACITY
      flame.radius = randomInt(15, 40)
      flame.sparks = generateSparks(flame.x, flame.y, flame.color, 3)
    }
  })
}

init()
animate()
