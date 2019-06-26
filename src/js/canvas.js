import utils from './utils'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

// Objects
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x: 0,
        y: 3,
    }
    this.friction = 0.8
    this.gravity = 1
}

Star.prototype.draw = function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
}

Star.prototype.update = function() {

    if(this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
        this.shatter()
    } else {
        this.velocity.y += this.gravity
    }

    this.x += this.velocity.x
    this.y += this.velocity.y

    this.draw()
}

Star.prototype.shatter = function() {
    this.radius -= 3
    for(let i = 0; i < 8; i++) {
        let color = utils.randomColor(colors)
        miniStars.push(new MiniStar(this.x, this.y, 2, color))
    }
}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color)

    this.velocity = {
        x: utils.randomIntFromRange(-5, 5),
        y: utils.randomIntFromRange(-15, 15),
    }
    this.friction = 0.8
    this.gravity = 0.1
    this.ttl = 100
    this.opacity = 1
}

MiniStar.prototype.draw = function () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.restore()
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
}

MiniStar.prototype.update = function () {

    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
    } else {
        this.velocity.y += this.gravity
    }

    this.x += this.velocity.x
    this.y += this.velocity.y
    this.ttl -= 1
    this.opacity -= 1 / this.ttl

    this.draw()
}

// Implementation
let stars
let miniStars

function init() {
    stars = []
    miniStars = []

    for (let i = 0; i < 1; i++) {
        let star = new Star(canvas.width / 2,canvas.height / 2, 30, 'red' )

        stars.push(star)
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    stars.forEach((star, index) => {
        star.update()
        if(star.radius == 0) {
            stars.splice(index, 1)
        }
    })

    miniStars.forEach((miniStar, index) => {
        miniStar.update()
        if (miniStar.ttl == 0) {
            miniStars.splice(index, 1)
        }
    })
}

init()
animate()
