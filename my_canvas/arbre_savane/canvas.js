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

//NB : tire des valeurs entre -4 et 4. Pas assez fort en maths pour avoir envie de comprendre pourquoi.
const gaussianRandom = () => {
  let r1,
    r2,
    w = 1

  while (w >= 1) {
    r1 = 2 * Math.random() - 1
    r2 = 2 * Math.random() - 1
    w = r1 * r1 + r2 * r2
  }

  w = Math.sqrt((-2 * Math.log(w)) / w)

  return r1 * w
}

const gaussianIntRandom = (ecart) => {
  return Math.floor((gaussianRandom() / 4) * ecart)
}

//CANVAS
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const canvas = document.querySelector("canvas")
canvas.width = WIDTH
canvas.height = HEIGHT
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

//CONST

const SECTION_SIZE = 20

//OBJECT

const generateTreeNode = (x, y, depth, width, scissionOdd, direction = "middle") => {
  let res = []

  let newX
  const newY = y - 5

  switch (direction) {
    case "middle":
      newX = x
      break
    case "left":
      newX = x - 5
      break
    case "right":
      newX = x + 5
      break
  }
  if (depth > 0) {
    // Il y a un % de chance de scinder la branche actuelle
    if (Math.random() < scissionOdd) {
      // On crée deux nouvelles branches, une à gauche une à droite
      res.push(new Section(x, y, newX + SECTION_SIZE, newY, width))
      res.push(new Section(x, y, newX - SECTION_SIZE, newY, width))

      const newWidth = (width * 3) / 4
      // On fait pousser les deux branches créées
      res = res.concat(generateTreeNode(newX + SECTION_SIZE, newY, depth - 1, newWidth, scissionOdd, "right"))
      res = res.concat(generateTreeNode(newX - SECTION_SIZE, newY, depth - 1, newWidth, scissionOdd, "left"))

      // Il y a une chance qu'une troisième branche centrale pousse
      if (Math.random() < 0.2) {
        res.push(new Section(x, y, newX, newY, width))
        res = res.concat(generateTreeNode(newX, newY, depth - 1, newWidth, scissionOdd, "middle"))
      }
    } else {
      // Cas commun : on agrandit la branche
      res.push(new Section(x, y, newX, newY, width))
      res = res.concat(generateTreeNode(newX, newY, depth, width, scissionOdd, direction))
    }
  } else {
    // Si on arrive au bout, on fait pousser une dernière branche
    res.push(new Section(x, y, newX, newY, width, true))
  }

  return res
}

function Arbre(x, y, color, depth, baseWidth) {
  this.x = x
  this.y = y
  this.color = color
  this.depth = depth
  this.baseWidth = baseWidth
  this.tree = []

  // On veut avoir un tronc d'une taille minimum
  this.trunkHeight = randomInt(10, 20)
  for (let i = 1; i <= this.trunkHeight; i++) {
    this.tree.push(new Section(this.x, this.y - SECTION_SIZE * (i - 1), this.x, this.y - SECTION_SIZE * i, this.baseWidth))
  }
  // Puis on génère les branches
  this.tree = this.tree.concat(generateTreeNode(this.x, this.y - SECTION_SIZE * this.trunkHeight, this.depth, this.baseWidth, 0.2, "middle"))
  this.tree.sort((s1, s2) => s2.yStart - s1.yStart)

  this.update = () => {
    this.draw()
  }

  this.draw = () => {
    const yBase = this.y - (this.trunkHeight * SECTION_SIZE) / 2
    c.moveTo(this.x - this.baseWidth * 1.5, this.y)
    c.quadraticCurveTo(this.x, this.y, this.x - this.baseWidth / 2, yBase)
    c.lineTo(this.x + this.baseWidth / 2, yBase)
    c.quadraticCurveTo(this.x, this.y, this.x + this.baseWidth * 1.5, this.y)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.strokeStyle = this.color
    this.tree.forEach((n) => n.draw())
    //Dessin de la base du tronc
  }
}

function Section(xStart, yStart, xEnd, yEnd, width, isEnd = false) {
  this.xStart = xStart
  this.yStart = yStart
  this.xEnd = xEnd
  this.yEnd = yEnd
  this.width = width
  this.isEnd = isEnd
  this.foliage = []

  if (this.isEnd) {
    let xLeaves = []
    for (let i = 0; i < 50; i++) {
      xLeaves.push(gaussianIntRandom(25))
    }
    xLeaves.sort((a, b) => a - b)
    xLeaves.forEach((xL) => {
      const yEcart = (15 * Math.abs(xL)) / 25
      const radius = (8 * Math.abs(xL)) / 25
      this.foliage.push({ x: this.xEnd + xL, y: this.yEnd + randomInt(-yEcart, yEcart), radius: radius })
    })
  }

  this.drawFoliage = () => {
    c.fillStyle = "red"
    this.foliage.forEach((f) => {
      c.beginPath()
      c.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
      c.fill()
      c.closePath()
    })
  }

  this.draw = () => {
    c.beginPath()
    c.moveTo(this.xStart, this.yStart)
    c.lineTo(this.xEnd, this.yEnd)
    c.lineWidth = this.width
    c.lineCap = "round"
    c.stroke()
    if (this.isEnd) {
      this.drawFoliage()
    }
  }
}

//IMPLEMENTATION
let arbre
const init = () => {
  arbre = new Arbre(WIDTH / 2, HEIGHT, "black", 5, 10)
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, WIDTH, HEIGHT)
  arbre.update()
}

init()
animate()
