const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext("2d")

const INNER_PADDING = 50

// on resize le canvas quand la fenetre est resized
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

function Foliage(x, y, size, mainFoliage) {
  this.x = x
  this.y = y
  this.size = size
  this.mainFoliage = mainFoliage

  this.subFoliage = this.mainFoliage ? createLeaves(this.x, this.y, 6, 10, 10, 15, this.size) : []

  this.draw = () => {
    c.beginPath()
    c.arc(x, y, size, 0, 2 * Math.PI)
    c.fillStyle = "#327358"
    c.fill()
    if (this.mainFoliage) {
      this.subFoliage.map((sF) => sF.draw())
    }
  }
}

function Bush(x, y) {
  this.x = x
  this.y = y

  this.foliages = createFoliage(this.x, this.y, 3, 5, 20, 30, true)

  this.draw = () => {
    this.foliages.map((f) => f.draw())
  }

  this.update = () => {
      
  }
}

createFoliage = (x, y, min, max, minSize, maxSize, mainFoliage) => {
  const nbFoliages = randomInt(min, max)
  let res = []
  for (let n = 0; n < nbFoliages; n++) {
    const size = randomInt(minSize, maxSize)
    const xF = randomInt(x - size / 2, x + size / 2)
    const yF = randomInt(y - size / 2, y + size / 2)
    res.push(new Foliage(xF, yF, size, mainFoliage))
  }
  return res
}

createLeaves = (x, y, min, max, minSize, maxSize, parentSize) => {
  const nbFoliages = randomInt(min, max)
  let res = []
  for (let n = 0; n < nbFoliages; n++) {
    const size = randomInt(minSize, maxSize)
    const angle = (randomInt(0, 360) * 180) / Math.PI
    const xF = Math.cos(angle) * parentSize + x
    const yF = Math.sin(angle) * parentSize + y
    res.push(new Foliage(xF, yF, size, false))
  }
  return res
}

createBushes = (qty) => {
  let res = []
  for (let i = 0; i < qty; i++) {
    x = randomInt(0 + INNER_PADDING, innerWidth - INNER_PADDING)
    y = randomInt(0 + INNER_PADDING, innerHeight - INNER_PADDING)
    res.push(new Bush(x, y))
  }
  return res
}

const bushes = createBushes(20)
bushes.map((b) => b.draw())
