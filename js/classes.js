class Sprite {
	// {} <-- wrap arguments in one object; becomes optional
	constructor({position, imageSrc, scale = 1, framesMax = 1}) {
		this.position = position	// position of Sprite
		this.width = 50				// static value for width of Sprite
		this.height = 150			// static value from height of Sprite
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 8
	}
	
	// Draw Sprite on canvas
	draw() {
		c.drawImage(
            this.image,
            // Crop image for animation
            this.frameCurrent * (this.image.width / this.framesMax), // Change x-value to new frame for animation
            0,
            this.image.width / this.framesMax, // Depends on the amount of frames
            this.image.height,            
            // Draw to Canvas            
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
	}

	// Update position of Sprite
	update() {
		this.draw()
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0){
            if (this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }      
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