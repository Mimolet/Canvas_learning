const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomColor = () => {
  const index = randomInt(0, 4)
  return colors[index]
}

const canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext("2d")

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  init()
})

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

window.addEventListener("click", () => {
  init()
})

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
}

const colors = ["#6C7780", "#8CC9FF", "#DAEEFF", "#466580", "#ADBECC"]

const GRAVITY = 1
const FRICTION = 0.59

function Ball(x, y, dy, dx, radius, color) {
  this.x = x
  this.y = y
  this.dy = dy
  this.dx = dx
  this.radius = radius
  this.color = color

  this.update = () => {
    this.y += this.dy
    if (this.y + this.radius + this.dy >= canvas.height) {
      this.dy = -this.dy * FRICTION
    } else {
      this.dy += GRAVITY
    }

    this.x += this.dx
    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.dx = -this.dx
    }
    this.draw()
  }

  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    c.fillStyle = this.color
    c.fill()
    c.strokeStyle = "white"
    c.stroke()
    c.closePath()
  }
}

//Implementation
let ballArray = []
const init = () => {
  ballArray = []
  for (var i = 0; i < 100; i++) {
    const radius = randomInt(30, 50)
    const x = randomInt(0 + radius, canvas.width - radius)
    const y = randomInt(100, 250)
    const dy = randomInt(1, 5)
    const dx = randomInt(-5, 5)
    const color = randomColor()
    ballArray.push(new Ball(x, y, dy, dx, radius, color))
  }
}

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  ballArray.map((b) => b.update())
}

init()
animate()
