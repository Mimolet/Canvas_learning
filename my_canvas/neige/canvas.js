//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomDecim = (min, max) => {
  return Math.random() * (max - min) + min
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

function Flocon(x, y, dy, radius, color, dOpacity) {
  this.x = x
  this.y = y
  this.dy = dy
  this.dx = 0
  this.radius = radius
  this.color = color
  this.dOpacity = dOpacity
  this.opacity = 1

  this.update = () => {
    if (this.y > innerHeight) {
      this.y = -50 - this.radius
    }

    this.y += this.dy
    this.x += this.dx

    if (this.y > innerHeight / 2) {
      this.opacity -= Math.abs(this.dOpacity)
      this.opacity = Math.max(0, this.opacity)
    }

    if (this.y < 0 - radius) {
      this.opacity = 1
    }

    this.draw()
  }
  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.save()
    c.globalAlpha = this.opacity
    c.fill()
    c.restore()
    c.closePath()
  }
}

//IMPLEMENTATION

const MAX_RADIUS = 7
const MIN_RADIUS = 2

let flocons
const init = () => {
  flocons = []
  for (let i = 0; i < 1000; i++) {
    const radius = randomInt(MIN_RADIUS, MAX_RADIUS)
    const x = randomInt(0 + radius, innerWidth - radius)
    const y = randomInt(-innerHeight, -MAX_RADIUS)
    const dy = randomDecim(1, 3)
    const dOpacity = randomDecim(0.01, 0.05)
    const color = randomColor()
    flocons.push(new Flocon(x, y, dy, radius, color, dOpacity))
  }
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  flocons.forEach((f) => f.update())
}

init()
animate()
