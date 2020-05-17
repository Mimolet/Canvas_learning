const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext("2d")

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, innerWidth, innerHeight)
}

animate()
