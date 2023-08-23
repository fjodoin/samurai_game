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
		this.lastKey
	}
	
	// Draw Sprite on canvas
	draw() {
		c.fillStyle = 'red'
		c.fillRect(this.position.x, this.position.y, 50, this.height)
	}

	// Update position of Sprite
	update() {
		this.draw()
		this.position.x += this.velocity.x
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

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}
}
let lastKey

// This method is necessary for making the game dynamic - "frame-by-frame"
function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height) // Clear frame to avoid "paint drip" effect
	player.update()
	enemy.update()

	// player movement
	player.velocity.x = 0
	if (keys.a.pressed && lastKey === 'a') {
		player.velocity.x = -1
	} else if (keys.d.pressed && lastKey === 'd') {
		player.velocity.x = 1
	}

	// enemy movement
	enemy.velocity.x = 0
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -1
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 1
	}
}

animate()

// Keydown event logic
window.addEventListener('keydown', (event) => {
	switch (event.key){
		// player keystrokes
		case 'a':
			keys.a.pressed = true	// move player to the left
			lastKey = 'a'
			break
		case 'd':
			keys.d.pressed = true	// move player to the right
			lastKey = 'd'
			break
		case 'w':
			player.velocity.y = -5
			break
		
		// enemy keystrokes
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true	// move player to the left
			enemy.lastKey = 'ArrowLeft'
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = true	// move player to the right
			enemy.lastKey = 'ArrowRight'
			break
		case 'ArrowUp':
			enemy.velocity.y = -5
			break
		
	}
	console.log(event)
})

// Keyup event logic
window.addEventListener('keyup', (event) => {
	// player keyups
	switch (event.key){
		case 'a':
			keys.a.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
	}

	// Enemy keyups
	switch (event.key) {
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break		
	}
	console.log(event)
})