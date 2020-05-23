const MAX_PLAYER_SPEED = 10
const FRICTION = 0.5

const myGameArea = {
  canvas: document.querySelector("canvas"),
  start: function () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.c = this.canvas.getContext("2d")
    this.interval = setInterval(updateGameArea, 20)
    window.addEventListener("keydown", (event) => {
      myGameArea.keys = myGameArea.keys || []
      myGameArea.keys[event.keyCode] = true
    })
    window.addEventListener("keyup", (event) => {
      myGameArea.keys[event.keyCode] = false
    })
  },
  clear: function () {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },
}

const updateGameArea = () => {
  myGameArea.clear()
  player.dx = 0
  player.dy = 0
  if (myGameArea.keys) {
    if (myGameArea.keys[37]) {
      player.dx = -1
    }
    if (myGameArea.keys[39]) {
      player.dx = 1
    }
    if (myGameArea.keys[38]) {
      player.dy = -1
    }
    if (myGameArea.keys[40]) {
      player.dy = 1
    }
  }
  player.update()
}

// GAME OBJECTS

function Rectangle(x, y, width, height, color) {
  this.x = x
  this.y = y
  this.dx = 0
  this.dy = 0
  this.width = width
  this.height = height
  this.color = color

  this.update = () => {
    this.x += this.dx
    this.y += this.dy
    this.draw()
  }

  this.draw = () => {
    c = myGameArea.c
    c.fillStyle = this.color
    c.fillRect(this.x, this.y, this.width, this.height)
  }
}

// INIT

let player
let obstacles

startGame = () => {
  obstacles = []
  obstacles.push(new Rectangle())
  myGameArea.start()
  player = new Rectangle(innerWidth / 2, innerHeight / 2, 30, 30, "#9E481D")
}

startGame()
