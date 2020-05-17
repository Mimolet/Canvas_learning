const canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext("2d")

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let polygons = []

// on resize le canvas quand la fenetre est resized
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

window.addEventListener("click", (event) => {
  polygons.push(createRandomPolygon(event.x, event.y))
})

function Polygon(x, y, size, nbSides, radialSpeed) {
  this.x = x
  this.y = y
  this.size = size
  this.nbSides = nbSides
  this.angle = 0

  this.draw = () => {
    c.beginPath()
    c.moveTo(this.x + this.size * Math.cos(this.angle), this.y + this.size * Math.sin(this.angle))

    for (let n = 0; n < this.nbSides + 1; n++) {
      c.lineTo(this.x + this.size * Math.cos(this.angle + (n * 2 * Math.PI) / this.nbSides), this.y + this.size * Math.sin(this.angle + (n * 2 * Math.PI) / this.nbSides))
    }

    c.strokeStyle = "white"
    c.lineWidth = 2
    c.stroke()
  }

  this.update = () => {
    this.angle += radialSpeed
    this.draw()
  }
}

const createConcentricPolygons = (qty) => {
  let res = []
  for (i = 0; i < qty; i++) {
    res.push(createRandomPolygon(innerWidth / 2, innerHeight / 2))
  }
  return res
}

const createRandomPolygon = (x, y) => {
  const size = randomNum(40, 300)
  const clockwise = Math.random() > 0.5 ? -1 : 1
  const nbSides = randomNum(10, 3)
  const speed = randomNum(100, 500)
  return new Polygon(x, y, size, nbSides, (clockwise * Math.PI) / speed)
}

const animate = () => {
  requestAnimationFrame(() => setTimeout(animate, 20))

  c.clearRect(0, 0, innerWidth, innerHeight)

  polygons.map((poly) => poly.update())
}

animate()
