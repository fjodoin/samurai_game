// Canvas setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

// Set background Sprites
const background = new Sprite({
	position:{
		x: 0,
		y: 0
	},
	imageSrc: './img/background.png'
})

// Set shop Sprites
const shop = new Sprite({
	position:{
		x: 350,
		y: 192
	},
	imageSrc: './img/shop.png',
	scale: 2.75,
	framesMax: 6
})

// Class object used to define players and enemies in game
const gravity = 0.7

// Create player object
const player = new Fighter({
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
	},
	imageSrc: './img/kenji/Sprites/Idle.png',
	scale: 2.5,
	framesMax: 8,
	offset: {
		x: 215,
		y: 152
	},
	sprites: {
		idle: {
			imageSrc: './img/kenji/Sprites/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/kenji/Sprites/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/kenji/Sprites/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/kenji/Sprites/Fall.png',
			framesMax: 2 
		},
		attack1: {
			imageSrc: './img/kenji/Sprites/Attack1.png',
			framesMax: 6 
		},
		takeHit: {
			imageSrc: './img/kenji/Sprites/Take Hit.png',
			framesMax: 4 
		},
		death: {
			imageSrc: './img/kenji/Sprites/Death.png',
			framesMax: 6 
		}  
	},
	attackBox: {
		offset: {
			x: 100,
			y: 50
		},
		width: 150,
		height: 50
	}	
})

// Create enemy object
const enemy = new Fighter({
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
	},
	imageSrc: './img/ryui/Sprites/Idle.png',
	scale: 2.5,
	framesMax: 4,
	offset: {
		x: 215,
		y: 152
	},
	sprites: {
		idle: {
			imageSrc: './img/ryui/Sprites/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './img/ryui/Sprites/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/ryui/Sprites/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/ryui/Sprites/Fall.png',
			framesMax: 2 
		},
		attack1: {
			imageSrc: './img/ryui/Sprites/Attack1.png',
			framesMax: 4 
		},
		takeHit: {
			imageSrc: './img/ryui/Sprites/Take hit.png',
			framesMax: 3 
		},
		death: {
			imageSrc: './img/ryui/Sprites/Death.png',
			framesMax: 7 
		}  
	},
	attackBox: {
		offset: {
			x: -200,
			y: 0
		},
		width: 180,
		height: 50
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

decreaseTimer()

// This method is necessary for making the game dynamic - "frame-by-frame"
function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height) // Clear frame to avoid "paint drip" effect
	background.update()
	shop.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.15)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	// player movement (lateral)
	player.velocity.x = 0
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -3
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 3
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}
	// player movement (vertical)
	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}

	// enemy movement (lateral)
	enemy.velocity.x = 0
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -3
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 3
		enemy.switchSprite('run')
	} else {
		enemy.switchSprite('idle')
	}
	// enemy movement (vertical)
	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}

	// detect collision: player >>> enemy
	if (rectangularCollision({
		rectangle1: player,
		rectangle2: enemy
		}) &&
		player.isAttacking && 
		player.frameCurrent === 4
		){
			enemy.takeHit()
			player.isAttacking = false
			console.log('player attack hit')
			gsap.to('#enemyHealth', {
				width: enemy.health + '%'
			})
	}
	// if player misses
	if (player.isAttacking && player.frameCurrent === 4 ) {
		player.isAttacking = false
		console.log('player miss')
	}

	// detect collision: enemy >>> player
	if (rectangularCollision({
		rectangle1: enemy,
		rectangle2: player
		}) &&
		enemy.isAttacking &&
		enemy.frameCurrent === 2
		){
			player.takeHit()
			enemy.isAttacking = false
			console.log('enemy attack hit')
			gsap.to('#playerHealth', {
				width: player.health + '%'
			})
	}
	// if enemy misses
	if (enemy.isAttacking && enemy.frameCurrent === 2 ) {
		enemy.isAttacking = false
	}

	// end game based on hp
	if (enemy.health <= 0 || player.health <= 0){
		determineWinner({player, enemy, timerId})
	}
}

animate()

// Keydown event logic
window.addEventListener('keydown', (event) => {
	if (!player.dead){
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
		}
	}
	if (!enemy.dead) {
		switch(event.key){
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