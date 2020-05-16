const canvas = document.querySelector("canvas")

//Le canvas prend toute la largeur/hauteur de la fenêtre
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext("2d")

/* const drawRandomCircles = () => {
  for (let i = 0; i < 50; i++) {
    let x = Math.random() * window.innerWidth
    let y = Math.random() * window.innerHeight
    let r = Math.random() * 255
    let g = Math.random() * 255
    let b = Math.random() * 255
    c.beginPath()
    c.arc(x, y, 50, 0, 2 * Math.PI)
    c.strokeStyle = `rgb(${r}, ${g}, ${b})`
    c.stroke()
  }
} */

// tuto animation

function Circle(x, y, radius, dx, dy) {
  this.x = x
  this.y = y
  this.dx = dx
  this.dy = dy
  this.radius = radius
  this.red = Math.random() * 255
  this.dRed = 3
  this.circleStyle = `rgb(${this.red}, 150 , 150)`

  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    c.strokeStyle = this.circleStyle
    c.fillStyle = this.circleStyle
    c.fill()
  }

  this.update = () => {
    if (this.x > innerWidth - this.radius || this.x < this.radius) {
      this.dx = -this.dx
    }

    if (this.y > innerHeight - this.radius || this.y < this.radius) {
      this.dy = -this.dy
    }

    this.x += this.dx
    this.y += this.dy

    if (this.red > 255 || this.red < 0) {
      this.dRed = -this.dRed
    }

    this.red = this.red + this.dRed
    this.circleStyle = `rgb(${this.red}, 150 , 150)`

    this.draw()
  }
}

const createMultipleCircles = (qty) => {
  let circles = []
  for (let i = 0; i < qty; i++) {
    let radius = Math.random() * 100
    let x = Math.random() * (innerWidth - radius * 2) + radius
    let y = Math.random() * (innerHeight - radius * 2) + radius
    //velocity
    let dx = (Math.random() - 0.5) * 7
    let dy = (Math.random() - 0.5) * 7

    circles.push(new Circle(x, y, radius, dx, dy))
  }
  return circles
}

const myCircles = createMultipleCircles(25)

const animate = () => {
  // on crée une boucle d'animation
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)

  myCircles.map((circle) => circle.update())
}

animate()
