//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const colors = ["#6C7780", "#8CC9FF", "#DAEEFF", "#466580", "#ADBECC"]
const randomColor = (colorArray) => {
  const index = randomInt(0, colorArray.length - 1)
  return colorArray[index]
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

const INIT_OPACITY = 0.5

function Color(r, g, b) {
  this.r = r
  this.g = g
  this.b = b

  this.getColor = () => {
    return `rgb(${this.r} ${this.g} ${this.b})`
  }

  this.changeColor = (dR, dG, dB) => {
    this.r = Math.max(0, this.r + dR)
    this.g = Math.max(0, this.g + dG)
    this.b = Math.max(0, this.b + dB)
  }
}

function Flame(x, y, radius, color) {
  this.x = x
  this.y = y
  this.dx = 0
  this.dy = -(1 - INIT_OPACITY) * 10
  this.radius = radius
  this.color = color
  this.opacity = INIT_OPACITY
  this.sparks = []
  this.radian = randomDecim(0, Math.PI * 2)

  this.update = () => {
    this.x += this.dx
    this.y += this.dy
    this.dy = -(1 - this.opacity) * 10
    this.radian += randomInt(Math.PI / 10, Math.PI / 30)
    this.dx = randomInt(1, 3) * Math.cos(this.radian)
    this.opacity += -0.02
    this.opacity = Math.max(this.opacity, 0)
    this.radius = Math.max(this.radius - 1, 0)
    this.color.changeColor(0, -3, -6)
    this.sparks.forEach((s) => s.update())
    this.draw()
  }
  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.save()
    c.globalAlpha = this.opacity
    c.fillStyle = this.color.getColor()
    c.fill()
    c.restore()
    c.closePath()
  }
}

function Spark(x, y, radius, color) {
  this.x = x
  this.y = y
  this.dx = 0
  this.dy = -randomInt(3, 7)
  this.radian = randomDecim(0, Math.PI * 2)
  this.radius = radius
  this.color = color

  this.update = () => {
    this.x += this.dx
    this.y += this.dy
    this.radian += randomInt(Math.PI / 50, Math.PI / 30)
    this.dx = randomInt(1, 3) * Math.cos(this.radian)
    this.draw()
  }

  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color.getColor()
    c.fill()
    c.closePath()
  }
}

const generateSparks = (x, y, color, qty) => {
  let sparks = []
  for (let i = 0; i < qty; i++) {
    const sX = randomInt(x - 10, x + 10)
    const sY = randomInt(y - 10, y + 10)
    sparks.push(new Spark(sX, sY, 1, color))
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
  const oX = innerWidth / 2
  const oY = (innerHeight * 3) / 4
  const initColor = new Color(255, 255, 255)
  if (flames.length < 50 && !flames.find((flame) => flame.x === oX && flame.y === oY)) {
    const x = randomInt(oX - 5, oX + 5)
    const y = randomInt(oY - 5, oY + 5)
    flames.push(new Flame(x, y, randomInt(15, 40), initColor))
  }
  flames.forEach((flame) => {
    flame.update()
    if (flame.opacity <= 0) {
      flame.x = randomInt(oX - 5, oX + 5)
      flame.y = randomInt(oY - 5, oY + 5)
      flame.opacity = INIT_OPACITY
      flame.radius = randomInt(15, 40)
      flame.color = initColor
    }
    if (Math.random() > 0.999 && flame.sparks.length < 2) {
      const sX = randomInt(oX - 10, oX + 10)
      const sY = randomInt(oY - 10, oY + 10)
      flame.sparks.push(new Spark(sX, sY, 1, flame.color))
    }
    flame.sparks.forEach((spark) => {
      // Si l'étincelle sort de l'écran
      if (spark.y <= 0) {
        spark.y = randomInt(oY - 10, oY + 10)
        spark.x = randomInt(oX - 10, oX + 10)
        spark.color = flame.color
      }
    })
  })
}

init()
animate()
