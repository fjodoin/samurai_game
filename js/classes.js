class Sprite {
	// {} <-- wrap arguments in one object; becomes optional
	constructor({position, imageSrc, scale = 1, framesMax = 1, offset = { x:0, y:0}}) {
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
        this.offset = offset
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
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
	}

    // Animate Frames
    animateFrames(){
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0){
            if (this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }   
    }

	// Update position of Sprite
	update() {
		this.draw()
        this.animateFrames()
	}
}

class Fighter extends Sprite {
	// {} <-- wrap arguments in one object; becomes optional
	constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0},
        sprites
    }) {    // remove duplicate offset
		super({                     // calls the constructor of extended class Sprite; inherit declared properties
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        // this.position = position	// position of Sprite
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

        // Hardcoded values
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 8
        this.sprites = sprites
        
        // loop through sprites object
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
	}

	// Update position of Sprite
	update() {
		this.draw()
        this.animateFrames()
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

        // Gravity
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 35){
			this.velocity.y = 0
            this.position.y = 391 // Hardcoded y position so sprite animation doesnt bug out
		} else this.velocity.y += gravity
        console.log(this.position.y)
	}

	attack() {
        this.switchSprite('attack1')
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 100)
	}

    switchSprite(sprite) {
        if (
            this.image === this.sprites.attack1.image && 
            this.frameCurrent < this.sprites.attack1.framesMax - 1
            ) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {    
                    this.image = this.sprites.jump.image
		            this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {    
                    this.image = this.sprites.fall.image
		            this.framesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {    
                    this.image = this.sprites.attack1.image
		            this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                break 
        }
    }
}