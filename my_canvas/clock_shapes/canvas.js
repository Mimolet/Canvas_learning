//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const colors = ["rgb(200, 30, 30)", "rgb(155, 30, 30)", "rgb(180, 30, 30)", "rgb(230, 30, 30)", "rgb(160, 30, 30)"]
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
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

window.addEventListener("click", (event) => {
  init()
})

//OBJECT

function Particle(x, y, radius, color, radian) {
  this.x = x
  this.y = y
  this.dx = 2
  this.dy = 2
  this.radius = radius
  this.color = color
  this.radian = radian

  this.update = () => {
    this.radian += 0.002
    if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
      this.x = canvas.width / 2
      this.y = canvas.height / 2
      this.radian = randomDecim(0, Math.PI * 2)
    }
    this.x = this.x + this.dx * Math.cos(this.radian)
    this.y = this.y + this.dy * Math.sin(this.radian)
    this.draw()
  }

  this.draw = () => {
    const { x, y, radius, color, opacity } = this

    c.beginPath()
    c.fillStyle = color
    c.strokeStyle = color
    c.arc(x, y, radius, 0, Math.PI * 2)
    c.fill()
    c.closePath()
  }
}

function Shape(x, y, radius, nbSides, color, startAngle, radV, discreteRotation) {
  this.x = x
  this.y = y
  this.radius = radius
  this.nbSides = nbSides
  this.color = color
  this.angle = startAngle
  this.radV = radV
  this.discreteRotation = discreteRotation
  this.countDiscrete = 0

  this.update = () => {
    if (this.discreteRotation) {
      if (this.countDiscrete >= 80) {
        this.angle += Math.PI / 10
        this.countDiscrete = 0
      } else {
        this.countDiscrete++
      }
    } else {
      this.angle += radV
    }
    this.draw()
  }
  this.draw = () => {
    const { x, y, radius, nbSides, color, angle } = this
    let drawAngle = angle
    c.beginPath()
    for (let i = 0; i < nbSides; i++) {
      if (i === 0) {
        c.moveTo(x + Math.cos(drawAngle) * radius, y + Math.sin(drawAngle) * radius)
      } else {
        c.lineTo(x + Math.cos(drawAngle) * radius, y + Math.sin(drawAngle) * radius)
      }
      drawAngle += (Math.PI * 2) / nbSides
    }
    c.lineWidth = 2
    c.strokeStyle = color
    c.closePath()
    c.save()
    c.globalAlpha = 0.2
    c.fillStyle = color
    c.fill()
    c.restore()
    c.stroke()
  }
}

//IMPLEMENTATION

let shapes = []
let particles = []

const init = () => {
  shapes = []
  particles = []
  const x = canvas.width / 2
  const y = canvas.height / 2
  for (let i = 0; i < 10; i++) {
    const radius = randomInt(30, 300)
    const nbSides = randomInt(5, 15)
    const color = randomColor()
    const startAngle = randomDecim(0, Math.PI * 2)
    const radV = randomDecim(-0.02, 0.02)
    const disRota = Math.random() > 0.8

    shapes.push(new Shape(x, y, radius, nbSides, color, startAngle, radV, disRota))
  }

  const pColor = randomColor()
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle(x, y, 2, pColor, randomDecim(0, Math.PI * 2)))
  }
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  // particles.forEach((p) => p.update())
  shapes.forEach((s) => s.update())
}

init()
animate()
