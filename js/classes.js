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
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
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
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
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
		
        // attackBoxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y
		
        // Show Fighters and Weapon boxes
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        this.position.x += this.velocity.x
		this.position.y += this.velocity.y

        // Gravity
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 35){
			this.velocity.y = 0
            this.position.y = 391 // Hardcoded y position so sprite animation doesnt bug out
		} else this.velocity.y += gravity
	}

	attack() {
        this.switchSprite('attack1')
		this.isAttacking = true
	}

    takeHit() {
        this.switchSprite('takeHit')
        this.health -= 20
    }

    switchSprite(sprite) {
        // override all animations
        if (
            this.image === this.sprites.attack1.image && 
            this.frameCurrent < this.sprites.attack1.framesMax - 1
            ) 
            return
        
        // override animations when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image && 
            this.frameCurrent < this.sprites.takeHit.framesMax - 1
            ) 
            return

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
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {    
                    this.image = this.sprites.takeHit.image
		            this.framesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
                break
        }
    }
}