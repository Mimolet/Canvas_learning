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

//OBJECT

function Tronc(x, y, width, height, color) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.color = color
  this.nbSubTrunks = randomInt(1, 3)
  this.trunkSections = []
  const sectionWidth = Math.floor(this.width / (this.nbSubTrunks * 2 - 1))
  console.log("XXX section width : ", sectionWidth)
  //tableau des abscisses gauche de chaque section verticale du tronc
  for (let i = 0; i < this.nbSubTrunks * 2; i++) {
    this.trunkSections[i] = this.x - this.width / 2 + sectionWidth * i
  }
  console.log("XXX trunkSections : ", this.trunkSections)
  this.update = () => {
    this.draw()
  }
  this.draw = () => {
    c.fillStyle = this.color
    for (let i = 0; i < this.trunkSections.length; i++) {
      if (i % 2 === 0) {
        c.fillRect(this.trunkSections[i], this.y, sectionWidth, this.height)
      }
    }
  }
}

//IMPLEMENTATION

let arbre

const init = () => {
  arbre = new Tronc(innerWidth / 2, innerHeight - 500, 200, 500, "white")
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  arbre.update()
}

init()
animate()
