import utils from './utils'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight

// Event Listeners

addEventListener('resize', () => {
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight

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
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.shadowColor = '#e3eaef'
    ctx.shadowBlur = 20
    ctx.fill()
    ctx.closePath()
    ctx.restore()
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
        miniStars.push(new MiniStar(this.x, this.y, 2, '#e3eaef'))
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
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.shadowColor = '#e3eaef'
    ctx.shadowBlur = 20
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}

MiniStar.prototype.update = function () {

    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
    } else {
        this.velocity.y += this.gravity
    }

    this.x += this.velocity.x
    this.y += this.velocity.y

    this.opacity -= 1 / this.ttl
    if(this.opacity < 0) this.opacity = 0

    this.ttl -= 1

    this.draw()
}

function createMountainRange(mountAmount, height, color) {
    for(let i = 0; i < mountAmount; i++) {
        const mountainWidth = canvas.width / mountAmount
        ctx.beginPath()
        ctx.moveTo(i * mountainWidth, canvas.height)
        ctx.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height)
        ctx.lineTo(i * mountainWidth + mountainWidth / 2 , canvas.height - height)
        ctx.lineTo(i * mountainWidth - 325, canvas.height)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
    }
}

// Implementation
const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#171e26')
backgroundGradient.addColorStop(1, '#3f586b')

let stars
let miniStars
let backgroundStars

function init() {
    stars = []
    miniStars = []
    backgroundStars = []

    for (let i = 0; i < 1; i++) {
        let star = new Star(canvas.width / 2,canvas.height / 2, 12, '#e3eafe' )

        stars.push(star)
    }

    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = utils.randomIntFromRange(1, 3)
        backgroundStars.push(new Star(x, y , radius, 'white'))
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)

    ctx.fillStyle = backgroundGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    backgroundStars.forEach(star => {
        star.draw()
    })

    createMountainRange(1, canvas.height - 50 , '#384551')
    createMountainRange(2, canvas.height - 150, '#2b3843')
    createMountainRange(3, canvas.height - 400, '#26333e')

    stars.forEach((star, i) => {
        star.update()
        if(star.radius == 0) {
            stars.splice(i, 1)
        }
    })

    miniStars.forEach((miniStar, i) => {
        miniStar.update()
        if (miniStar.ttl == 0) {
            miniStars.splice(i, 1)
        }
    })

}

init()
animate()
