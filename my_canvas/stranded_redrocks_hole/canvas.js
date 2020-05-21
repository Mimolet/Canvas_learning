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

const randomPointInDonut = (x, y, radius, width) => {
  let distance
  const angle = Math.random() * Math.PI * 2
  //if we just want a point in a circle
  if (width / 2 >= radius) {
    distance = randomInt(-2 * radius, 2 * radius)
  } else {
    distance = randomInt(radius - width / 2, radius + width / 2)
  }
  const rX = x + Math.cos(angle) * distance
  const rY = y + Math.sin(angle) * distance

  return { x: rX, y: rY }
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

function Particle(x, y, radius, color, opacity) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color
  this.opacity = opacity
  this.dOpacity = (Math.random() - 0.5) * 0.1

  this.update = () => {
    if (this.opacity <= 0 || this.opacity >= 1) {
      this.dOpacity = -this.dOpacity
    }
    this.opacity += this.dOpacity
    this.opacity = Math.max(0, this.opacity)
    this.draw()
  }
  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.save()
    c.globalAlpha = this.opacity
    c.fillStyle = this.color
    c.fill()
    c.restore()
    c.strokeStyle = this.color
    // c.stroke()
    c.closePath()
  }
}

//IMPLEMENTATION

let particles
const init = () => {
  particles = []
  const nbCircles = 10
  for (let j = 0; j < nbCircles + 1; j++) {
    const width = ((1 / nbCircles) * canvas.width) / 2
    const radius = (((((1 + 2 * j) * 1) / 4) * 1) / nbCircles) * canvas.width
    for (let i = 0; i < 200; i++) {
      const size = 5 * j
      const point = randomPointInDonut(canvas.width / 2, canvas.height / 2, radius, width)
      const color = colors[1]
      const opacity = Math.random()
      particles.push(new Particle(point.x, point.y, size, color, opacity))
    }
  }
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  particles.forEach((p) => p.update())
}

init()
animate()
