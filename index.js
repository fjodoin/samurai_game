// Canvas setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

// Class object used to define players and enemies in game
const gravity = 0.2
class Sprite {
	// {} <-- wrap arguments in one object; becomes optional
	constructor({position, velocity}) {
		this.position = position	// position of Sprite
		this.velocity = velocity	// speed of Sprite
		this.height = 150			// static value from height of Sprite draw()
	}
	
	// Draw Sprite on canvas
	draw() {
		c.fillStyle = 'red'
		c.fillRect(this.position.x, this.position.y, 50, this.height)
	}

	// Update position of Sprite
	update() {
		this.draw()
		this.position.y += this.velocity.y

		if (this.position.y + this.height + this.velocity.y >= canvas.height){
			this.velocity.y = 0
		} else this.velocity.y += gravity
	}
}

// Create player object
const player = new Sprite({
	// Set position on player
	position: {
		x: 0,	// Lateral position
		y: 0 	// Vertical position
	},
	// Set velocity of player
	velocity: {
		x: 0,	// Lateral movement
		y: 10 	// Vertical movement
	}	
})

// Create enemy object
const enemy = new Sprite({
	// Set position on enemy
	position: {
		x: 400,	// Lateral position
		y: 100 	// Vertical position
	},
	// Set velocity of enemy
	velocity: {
		x: 0,	// Lateral movement
		y: 10 	// Vertical movement
	}	
})

// This method is necessary for making the game dynamic - "frame-by-frame"
function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height) // Clear frame to avoid "paint drip" effect
	player.update()
	enemy.update()
}

animate()

// Testing ssh keys...