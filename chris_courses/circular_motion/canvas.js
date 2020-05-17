//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const colors = ["#6C7780", "#8CC9FF", "#DAEEFF", "#466580", "#ADBECC"]
const randomColor = () => {
  const index = randomInt(0, 4)
  return colors[index]
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

function Particle(x, y, radius, color, radians) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color
  this.radians = radians
  this.velocity = 0.05
  this.distanceFromCenter = randomInt(50, 120)
  this.lastMouse = { x: x, y: y }

  this.update = () => {
    const lastPoint = { x: this.x, y: this.y }

    //drag effect

    this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05

    this.radians += this.velocity
    this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter
    this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter

    this.draw(lastPoint)
  }

  this.draw = (lastPoint) => {
    c.beginPath()
    c.strokeStyle = this.color
    c.lineWidth = this.radius
    c.moveTo(lastPoint.x, lastPoint.y)
    c.lineTo(this.x, this.y)
    c.stroke()

    c.closePath()
  }
}

//IMPLEMENTATION

let particles

const init = () => {
  particles = []

  for (let i = 0; i < 80; i++) {
    const radians = Math.random() * Math.PI * 2

    const radius = randomInt(1, 5)
    particles.push(new Particle(canvas.width / 2, canvas.height / 2, radius, randomColor(), radians))
  }
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  //c.clearRect(0, 0, innerWidth, innerHeight)
  c.fillStyle = "rgba(0, 0, 0, 0.05"
  c.fillRect(0, 0, canvas.width, canvas.height)
  particles.forEach((p) => p.update())
}

init()
animate()
