class Player {
    constructor(x, y, width, height) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = 10;
        this.gravity = 0.5;
        this.onGround = false;

        // Load images
        this.newImageUp = new Image();
        this.newImageUp.src = "assets/eduardo-up.png";
        this.newImageUp.onload = () => console.log("ImageUp loaded");

        this.newImageStill = new Image();
        this.newImageStill.src = "assets/eduardo-still.png";
        this.newImageStill.onload = () => console.log("ImageStill loaded");

        this.newImageLeft = new Image();
        this.newImageLeft.src = "assets/eduardo-left.png";
        this.newImageLeft.onload = () => console.log("ImageLeft loaded");

        this.newImageRight = new Image();
        this.newImageRight.src = "assets/eduardo-right.png";
        this.newImageRight.onload = () => console.log("ImageRight loaded");

        this.NewImagePayCheck = new Image();
        this.NewImagePayCheck.src = "assets/paycheck.png";
        this.NewImagePayCheck.onload = () => console.log("ImagePayCheck loaded");
    }

    update(keys, platforms, enemies,) {
        this.velocityY += this.gravity;

        if (keys["ArrowLeft"] || keys["KeyA"]) this.velocityX = -this.speed;
        else if (keys["ArrowRight"] || keys["KeyD"]) this.velocityX = this.speed;
        else this.velocityX = 0;

        if (keys["Space"] && this.onGround || keys["ArrowUp"] && this.onGround || keys["KeyW"] && this.onGround) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        this.onGround = false;
        platforms.forEach((platform) => {
            if (
                this.y + this.height > platform.y &&
                this.y + this.height - this.velocityY <= platform.y &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
            }

            enemies.forEach((enemy) => {
                if (
                    this.x < enemy.x + enemy.width &&
                    this.x + this.width > enemy.x &&
                    this.y < enemy.y + enemy.height &&
                    this.y + this.height > enemy.y
                ) {
                    this.respawn();
                    const event = new Event('death');
                    window.dispatchEvent(event);
                }
            });

            

            if (this.y > 600) {
                this.respawn();
                const event = new Event("death");
                window.dispatchEvent(event);
            }
        });


    }

    respawn() {
        console.log("Player died - now respawning");
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
    }


    draw(ctx, cameraX, cameraY) {
        if (this.velocityX === 0 && this.onGround) {
            ctx.drawImage(this.newImageStill, this.x - cameraX, this.y - cameraY, this.width, this.height);
        }
        if (this.velocityX < 0 && this.onGround) {
            ctx.drawImage(this.newImageLeft, this.x - cameraX, this.y - cameraY, this.width, this.height);
        }
        if (this.velocityX > 0 && this.onGround) {
            ctx.drawImage(this.newImageRight, this.x - cameraX, this.y - cameraY, this.width, this.height);
        }
        if (!this.onGround || this.velocityY > 0) {
            ctx.drawImage(this.newImageUp, this.x - cameraX, this.y - cameraY, this.width, this.height);
        }
    }
}