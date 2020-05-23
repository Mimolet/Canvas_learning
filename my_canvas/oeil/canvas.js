//UTILS

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const redColors = ["#45110D", "#D13228", "#852019", "#91231C", "#6B1A14"]
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

//OBJECT

function Oeil(x, y, radius, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color

  this.update = () => {
    this.draw()
  }
  this.draw = () => {
    //Dessin du contour
    c.beginPath()
    const xLeft = this.x - 3 * this.radius
    const xRight = this.x + 3 * this.radius
    const yRight = this.y + this.radius / 2
    const yControlUp = this.y - 2 * this.radius
    const xControlDown = this.x - this.radius
    const yControlDown = this.y + 3 * this.radius
    c.moveTo(xLeft, this.y)
    c.quadraticCurveTo(this.x, yControlUp, xRight, yRight)
    c.quadraticCurveTo(xControlDown, yControlDown, xLeft, this.y)

    c.lineWidth = 10
    c.strokeStyle = redColors[4]
    c.clip()
    c.stroke()

    c.globalCompositeOperation = "destination-over"

    

    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.strokeStyle = redColors[0]
    c.lineWidth = 6
    c.lineJoin = "round"
    c.stroke()
    c.fillStyle = redColors[2]
    c.fill()

    c.globalCompositeOperation = "source-over"

    c.beginPath()
    c.arc(this.x, this.y, this.radius / 3, 0, Math.PI * 2)
    c.fillStyle = "black"
    c.fill()
  }
}

//IMPLEMENTATION

let oeil
const init = () => {
  oeil = new Oeil(innerWidth / 2, innerHeight / 2, 50, "white")
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  oeil.update()
}

init()
animate()
