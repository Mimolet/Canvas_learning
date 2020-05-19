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

//OBJECTS

function ParticuleExt(x, y, radius, color, velocity) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color
  this.radian = 0
  this.velocity = velocity

  this.update = () => {
    this.radian += this.velocity
    this.y = y + Math.sin(this.radian) * 50
    this.draw()
  }

  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }
}

//IMPLEMENTATION

const drawStick = (x, y, size) => {
  c.beginPath()
  c.moveTo(xO, yO)
  c.lineTo(xO + stickWidth, yO)
  c.strokeStyle = "blue"
  c.stroke()
}

let bordureExt

const stickWidth = 300
const xO = 200
const yO = 200

const init = () => {
  bordureExt = []

  for (let i = 1; i <= stickWidth; i++) {
    const x = xO + i
    const coeff = i / stickWidth + 1
    const y = Math.sin(-Math.PI * coeff) * stickWidth + yO

    bordureExt.push(new ParticuleExt(x, y, 1, "white", Math.sin(-Math.PI * coeff) / 10))
  }

  // drawStick(xO, yO, stickWidth)
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  // drawStick(xO, yO, stickWidth)
  bordureExt.forEach((p) => p.update())
}

init()
bordureExt.forEach((p) => p.draw())
animate()
