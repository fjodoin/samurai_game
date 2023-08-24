class Sprite {
	// {} <-- wrap arguments in one object; becomes optional
	constructor({position, imageSrc}) {
		this.position = position	// position of Sprite
		this.width = 50				// static value for width of Sprite
		this.height = 150			// static value from height of Sprite
        this.image = new Image()
        this.image.src = imageSrc
	}
	
	// Draw Sprite on canvas
	draw() {
		c.drawImage(this.image, this.position.x, this.position.y)
	}

	// Update position of Sprite
	update() {
		this.draw()
		// update later
	}
}

class Fighter {
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
		this.health = 100 // Start with 100 hp
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

		if (this.position.y + this.height + this.velocity.y >= canvas.height - 35){
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