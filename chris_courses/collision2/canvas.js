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

const rotate = (velocity, angle) => {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  }

  return rotatedVelocities
}

const resolveCollision = (particle, otherParticle) => {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y

  const xDist = otherParticle.x - particle.x
  const yDist = otherParticle.y - particle.y

  //prevent accidential overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    //Grab angle between the two colliding particles
    const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x)

    //Store mass in var for better readability in collision equation
    const m1 = particle.mass
    const m2 = otherParticle.mass

    //Velocity before equation
    const u1 = rotate(particle.velocity, angle)
    const u2 = rotate(otherParticle.velocity, angle)

    //Velocity after 1d collision equation

    const v1 = { x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2), y: u1.y }
    const v2 = { x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2), y: u2.y }

    //Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle)
    const vFinal2 = rotate(v2, -angle)

    //Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x
    particle.velocity.y = vFinal1.y

    otherParticle.velocity.x = vFinal2.x
    otherParticle.velocity.y = vFinal2.y
  }
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

function Particle(x, y, radius, color) {
  this.x = x
  this.y = y
  this.velocity = {
    x: (Math.random() - 0.5) * 5,
    y: (Math.random() - 0.5) * 5,
  }
  this.radius = radius
  this.color = color
  this.mass = 0.1 * radius
  this.opacity = 0

  this.update = (particles) => {
    this.draw()

    for (let i = 0; i < particles.length; i++) {
      if (this !== particles[i]) {
        if (getDistance(this.x, this.y, particles[i].x, particles[i].y) - this.radius - particles[i].radius < 0) {
          resolveCollision(this, particles[i])
        }
      }
    }

    //Collision detection
    if (this.x - radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x
    }
    if (this.y - radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y
    }

    //mouse
    if (getDistance(mouse.x, mouse.y, this.x, this.y) < 100 && this.opacity < 0.6) {
      this.opacity += 0.04
    } else if (this.opacity > 0) {
      this.opacity -= 0.05
      this.opacity = Math.max(0, this.opacity)
    }

    this.x += this.velocity.x
    this.y += this.velocity.y
  }
  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    c.save()
    c.globalAlpha = this.opacity
    c.fillStyle = this.color
    c.fill()
    c.restore()
    c.strokeStyle = this.color
    c.stroke()
    c.closePath()
  }
}

//IMPLEMENTATION

let particles
const init = () => {
  particles = []
  for (let i = 0; i < 200; i++) {
    const radius = 15
    let x = randomInt(radius, innerWidth - radius)
    let y = randomInt(radius, innerHeight - radius)
    const color = randomColor()

    // on ne veut pas que les particules overlap
    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (getDistance(x, y, particles[j].x, particles[j].y) - radius - particles[j].radius < 0) {
          x = randomInt(radius, innerWidth - radius)
          y = randomInt(radius, innerHeight - radius)

          // sera incrémenté à 0 à la fin de l'itération
          j = -1
        }
      }
    }

    particles.push(new Particle(x, y, radius, color))
  }
}

//ANIMATION

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
  particles.forEach((p) => p.update(particles))
}

init()
animate()
