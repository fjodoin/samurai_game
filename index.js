// Canvas setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

// Class object used to define players and enemies in game
const gravity = 0.7

class Sprite {
	// {} <-- wrap arguments in one object; becomes optional
	constructor({position, velocity, color = 'red', offset}) {
		this.position = position	// position of Sprite
		this.velocity = velocity	// speed of Sprite
		this.width = 50				// static value for width of Sprite
		this.height = 150			// static value from height of Sprite
		this.lastKey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: offset,
			width: 100,
			height: 50
		}
		this.color = color
		this.isAttacking
	}
	
	// Draw Sprite on canvas
	draw() {
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height)

		// draw attackBox
		if (this.isAttacking) {
			c.fillStyle = 'green'
			c.fillRect (
				this.attackBox.position.x,
				this.attackBox.position.y,
				this.attackBox.width,
				this.attackBox.height
			)
		}
	}

	// Update position of Sprite
	update() {
		this.draw()
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.position.y + this.height + this.velocity.y >= canvas.height){
			this.velocity.y = 0
		} else this.velocity.y += gravity
	}

	attack() {
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 100)
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
	},
	offset: {
		x: 0,
		y: 0
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
	},
	color: 'blue',
	offset: {
		x: -50,
		y: 0
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

function rectangularCollision({rectangle1, rectangle2}) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}

// This method is necessary for making the game dynamic - "frame-by-frame"
function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height) // Clear frame to avoid "paint drip" effect
	player.update()
	enemy.update()

	// player movement
	player.velocity.x = 0
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -3
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 3
	}

	// enemy movement
	enemy.velocity.x = 0
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -3
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 3
	}

	// detect collision: player >>> enemy
	if (rectangularCollision({
		rectangle1: player,
		rectangle2: enemy
		}) &&
		player.isAttacking
		){
			player.isAttacking = false
			console.log('player attack hit')
	}

	// detect collision: enemy >>> player
	if (rectangularCollision({
		rectangle1: enemy,
		rectangle2: player
		}) &&
		enemy.isAttacking
		){
			enemy.isAttacking = false
			console.log('enemy attack hit')
	}
}

animate()

// Keydown event logic
window.addEventListener('keydown', (event) => {
	switch (event.key){
		// player keystrokes
		case 'a':
			keys.a.pressed = true	// move player to the left
			player.lastKey = 'a'
			break
		case 'd':
			keys.d.pressed = true	// move player to the right
			player.lastKey = 'd'
			break
		case 'w':
			player.velocity.y = -15
			break
		case ' ':
			player.attack()
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
			enemy.velocity.y = -15
			break
		case 'Enter':
			enemy.attack()
			break
		
	}
	//console.log(event)
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
	//console.log(event)
})