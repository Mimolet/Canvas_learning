//UTILS

const randomInt = (min, max) => {
  if (min > max) {
    return Math.floor(Math.random() * (min - max + 1)) + max
  } else {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

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

const randomIntAroundPoint = (coord, var1, var2) => {
  return randomInt(coord + var1, coord + var2)
}

// HTML INTERFACE

// Sparks checkbox
let isThereSparks = false
const sparksCheckbox = document.querySelector("#sparks")
sparksCheckbox.addEventListener("change", function () {
  isThereSparks = this.checked
})

// Flame color ranges
const redRange = document.querySelector("#red")
const greenRange = document.querySelector("#green")
const blueRange = document.querySelector("#blue")

let redValue = redRange.value
let greenValue = greenRange.value
let blueValue = blueRange.value

redRange.addEventListener("input", function () {
  redValue = this.value
})
greenRange.addEventListener("input", function () {
  greenValue = this.value
})
blueRange.addEventListener("input", function () {
  blueValue = this.value
})

//CANVAS
const canvas = document.querySelector("canvas")
canvas.width = (window.innerWidth * 8) / 10
canvas.height = window.innerHeight
const c = canvas.getContext("2d")

//WINDOW
window.addEventListener("resize", () => {
  canvas.width = (window.innerWidth * 8) / 10
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
  if (mouse.x < canvas.width) {
    fires.push(new Fire(mouse.x, mouse.y))
  }
})

//OBJECT

const INIT_OPACITY = 0.1
const MAX_OPACITY = 0.4

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

function Fire(x, y) {
  this.x = x
  this.y = y
  this.flames = []
}

function Flame(x, y, radius, color) {
  this.x = x
  this.y = y
  this.dx = 0
  this.dy = -(1 - INIT_OPACITY) * 10
  this.radius = radius
  this.initRadius = radius
  this.radiusDecay = false
  this.color = color
  this.opacity = INIT_OPACITY
  this.opacityDecay = false
  this.sparks = []
  this.radian = randomDecim(0, Math.PI * 2)

  this.reinit = (x, y, initColor) => {
    this.x = x
    this.y = y
    this.opacity = INIT_OPACITY
    this.radius = randomInt(10, 20)
    this.initRadius = this.radius
    this.radiusDecay = false
    this.color = initColor
    this.opacityDecay = false
  }

  this.update = () => {
    this.x += this.dx
    this.y += this.dy

    this.dy = -(1 - this.opacity) * 10

    this.radian += randomInt(Math.PI / 10, Math.PI / 30)
    this.dx = randomInt(1, 3) * Math.cos(this.radian)

    // La flamme croît en intensité avant de décroître
    if (this.opacity < MAX_OPACITY && !this.opacityDecay) {
      this.opacity = Math.max(this.opacity + 0.07, 0)
    } else {
      if (!this.opacityDecay) {
        this.opacityDecay = true
      }
      this.opacity = Math.max(this.opacity - 0.02, 0)
    }

    // La flamme croît en taille avant de décroître
    if (this.radius < 2 * this.initRadius && !this.radiusDecay) {
      this.radius += 2
    } else {
      if (!this.radiusDecay) {
        this.radiusDecay = true
      }
      this.radius = Math.max(this.radius - 1, 0)
    }

    // Idem qu'en dessous, passer des variables globales comme ça,
    // c'est pas une bonne pratique je pense.
    // Commenter par ordre chronologique et pas de haut en bas
    // c'est pas fou non plus.
    this.color.changeColor(-redValue, -greenValue, -blueValue)

    // A voir si c'est intelligent de mettre ça là.
    // Dans l'absolu, je suis pas convaincu du bien-fondé de la chose.
    // Mais tout de suite c'est le plus simple.
    if (isThereSparks) {
      this.sparks.forEach((s) => s.update())
    }

    this.draw()
  }
  this.draw = () => {
    const gradient = c.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius)
    gradient.addColorStop(0, this.color.getColor())
    gradient.addColorStop(1, "transparent")

    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.save()
    c.globalAlpha = this.opacity
    c.fillStyle = gradient /* this.color.getColor() */
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

let fires = []

const init = () => {
  fires = []
}

//ANIMATION

// Gestion du nombre de FPS
let stop = false
let frameCount = 0
let fps, fpsInterval, startTime, now, then, elapsed

const startAnimating = (fps) => {
  fpsInterval = 1000 / fps
  then = Date.now()
  startTime = then
  animate()
}

const animate = () => {
  requestAnimationFrame(animate)

  // Gestion du nombre de FPS
  now = Date.now()
  elapsed = now - then
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval)

    c.clearRect(0, 0, canvas.width, canvas.height)
    fires.forEach((fire) => animateFlames(fire.flames, fire.x, fire.y))
  }
}

const animateFlames = (flames, oX, oY) => {
  const initColor = new Color(255, 255, 255)
  if (flames.length < 50 && !flames.find((flame) => flame.x === oX && flame.y === oY)) {
    const x = randomIntAroundPoint(oX, -5, 5)
    const y = randomIntAroundPoint(oY, -5, 5)
    flames.push(new Flame(x, y, randomInt(10, 20), initColor))
  }
  flames.forEach((flame) => {
    flame.update()
    // Si une flamme n'est plus visible, elle est renvoyée à la base du feu
    if (flame.opacity <= 0) {
      const newX = randomIntAroundPoint(oX, -5, 5)
      const newY = randomIntAroundPoint(oY, -5, 5)
      flame.reinit(newX, newY, initColor)
    }
    // Gestion des étincelles
    if (Math.random() > 0.999 && flame.sparks.length < 2) {
      const sX = randomIntAroundPoint(oX, -10, 10)
      const sY = randomIntAroundPoint(oY, -10, 10)
      flame.sparks.push(new Spark(sX, sY, 1, flame.color))
    }
    flame.sparks.forEach((spark) => {
      // Si l'étincelle sort de l'écran
      if (spark.y <= 0) {
        spark.y = randomIntAroundPoint(oY, -10, 10)
        spark.x = randomIntAroundPoint(oX, -10, 10)
        spark.color = flame.color
      }
    })
  })
}

init()
startAnimating(60)
