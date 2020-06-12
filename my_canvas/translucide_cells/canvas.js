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

const MOUSE_VISCINITY = 200

//OBJECT

function Cell(x, y, radius, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color
  this.isNearMouse = false

  this.update = () => {
    if (getDistance(this.x, this.y, mouse.x, mouse.y) < MOUSE_VISCINITY) {
      this.isNearMouse = true
    } else {
      this.isNearMouse = false
    }
    this.draw()
  }
  this.draw = () => {
    const grad = c.createLinearGradient(mouse.x, mouse.y, this.x, this.y)
    grad.addColorStop(0, "green")
    grad.addColorStop(1, "black")
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.isNearMouse ? grad : this.color
    c.fill()
    c.closePath()
  }
}

//IMPLEMENTATION

const generateCells = (nbCells) => {
  let res = []
  for (let i = 0; i < nbCells; i++) {
    const radius = randomInt(30, 50)
    let x = randomInt(0, innerWidth)
    let y = randomInt(0, innerHeight)

    // on ne veut pas que les particules overlap
    if (i !== 0) {
      for (let j = 0; j < res.length; j++) {
        if (getDistance(x, y, res[j].x, res[j].y) - radius - res[j].radius < 0) {
          x = randomInt(radius, innerWidth - radius)
          y = randomInt(radius, innerHeight - radius)

          // sera incrémenté à 0 à la fin de l'itération
          j = -1
        }
      }
    }

    res.push(new Cell(x, y, radius, "black"))
  }
  return res
}

let cells = []
const init = () => {
  cells = generateCells(80)
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  cells.forEach((cell) => cell.update())
}

init()
animate()
