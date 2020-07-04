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
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

//OBJECT

function Bird(x, y, dx, dy, radius, color) {
  this.pos = { x: x, y: y }
  this.velocity = { dx: dx, dy: dy }
  this.radius = radius
  this.color = color

  this.update = () => {
    this.draw()
  }
  this.draw = () => {
    const { pos, velocity, color, radius } = this
    const lenght = c.beginPath()
    c.moveTo(pos.x - radius, pos.y - radius)
    c.lineTo(pos.x + Math.sign(velocity.dx) * radius, pos.y + Math.sign(velocity.dy) * radius)
    c.strokeStyle = color
    c.lineWidth = 3
    c.stroke()
    c.closePath()
  }
}

//IMPLEMENTATION

let birds = []
const init = () => {
  const radius = 10

  for (let i = 0; i < 20; i++) {
    const dx = randomInt(-radius, radius)
    const dy = randomInt(-radius, radius)
    let x = randomInt(radius, canvas.width - radius)
    let y = randomInt(radius, canvas.height - radius)

    // on ne veut pas que les particules overlap
    if (i !== 0) {
      for (let j = 0; j < birds.length; j++) {
        if (getDistance(x, y, birds[j].x, birds[j].y) - radius - birds[j].radius < 0) {
          x = randomInt(radius, innerWidth - radius)
          y = randomInt(radius, innerHeight - radius)

          // sera incrémenté à 0 à la fin de l'itération
          j = -1
        }
      }
    }

    birds.push(new Bird(x, y, dx, dy, radius, colors[2]))
  }
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  birds.forEach((bird) => bird.update())
}

init()
animate()
