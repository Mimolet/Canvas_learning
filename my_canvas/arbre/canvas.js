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

const rotate = (origin, end, angle) => {
  const distance = getDistance(origin.x, origin.y, end.x, end.y)
  const x = Math.cos(0)
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

const spreadAngle = Math.PI / 3

const generateTree = (depth, startPoint, height, color, angle, width) => {
  let tree = []
  if (depth > 0) {
    // Attention : lié à la valeur en dur de spreadAngle de PI/3
    const randomizedAngle = angle * (Math.cos(angle) + Math.random() * (1 - 0.5) + 0.5)

    const x1 = startPoint.x - Math.cos(randomizedAngle) * height
    const y1 = startPoint.y - Math.sin(randomizedAngle) * height
    const x2 = startPoint.x - Math.cos(Math.PI - randomizedAngle) * height
    const y2 = startPoint.y - Math.sin(Math.PI - randomizedAngle) * height

    tree.push(new Branche(startPoint.x, startPoint.y, x1, y1, color, width))
    tree.push(new Branche(startPoint.x, startPoint.y, x2, y2, color, width))

    const height1 = (height * 2) / 3
    const height2 = (height * 2) / 3

    tree = tree.concat(generateTree(depth - 1, { x: x1, y: y1 }, height1, color, randomizedAngle, (width * 3) / 5))
    tree = tree.concat(generateTree(depth - 1, { x: x2, y: y2 }, height2, color, randomizedAngle, (width * 3) / 5))
  }
  return tree
}

function Branche(xStart, yStart, xEnd, yEnd, color, width) {
  this.xStart = xStart
  this.yStart = yStart
  this.xEnd = xEnd
  this.yEnd = yEnd
  this.color = color
  this.width = width

  this.draw = () => {
    c.beginPath()
    c.moveTo(this.xStart, this.yStart)
    c.lineTo(this.xEnd, this.yEnd)
    c.lineWidth = this.width
    c.lineCap = "round"
    c.strokeStyle = this.color
    c.stroke()
  }
}

function Arbre(x, y, height, width, color, depth) {
  this.x = x
  this.y = y
  this.height = height
  this.width = width
  this.color = color

  this.depth = depth

  this.tree = [new Branche(this.x, this.y, this.x, this.y - height, this.color, 20)]
  this.tree = this.tree.concat(generateTree(this.depth, { x: this.x, y: this.y - height }, this.height, this.color, spreadAngle, 15))

  this.update = () => {
    this.draw()
  }
  this.draw = () => {
    this.tree.forEach((t) => {
      t.draw()
    })
  }
}

//IMPLEMENTATION

let arbre

const init = () => {
  arbre = new Arbre(canvas.width / 2, canvas.height, canvas.height / 4, 50, colors[1], 8)
  const x1 = Math.cos(Math.PI / 3 - Math.PI / 3) * 200
  const y1 = canvas.height - Math.sin(spreadAngle) * 200
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  arbre.update()
}

init()
// animate()
arbre.draw()

/* c.beginPath()
c.strokeStyle = "red"
c.arc(innerWidth / 2, innerHeight / 2, 30, 0, Math.PI / 2)
c.lineWidth = 2
c.stroke() */
