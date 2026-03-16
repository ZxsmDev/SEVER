import Entity from "./entity.js";

export default class Enemy extends Entity {
  constructor(gameManager, x, y, width, height) {
    super(gameManager, x, y, width, height);
    this.speed = 100;
    this.gravity = 800;
    this.facing = Math.random() < 0.5 ? 1 : -1;
    this.target = this.generateTarget();
    this.reachedTarget = false;
    this.seenPlayer = false;
    this.stoppingDistance = 50;
  }
  render() {
    this.game.ctx.fillStyle = "red";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    if (this.reachedTarget || (!this.seenPlayer && !this.castToTarget())) {
      // If the target is reached or blocked, generate a new target
      this.facing = Math.random() < 0.5 ? 1 : -1;
      this.target = this.generateTarget();
      this.reachedTarget = false;
    }

    this.radialSight();
    this.reachedTarget = Math.abs(this.target - this.x) < 5;
    this.vx = this.facing * this.speed;
    
    if (Math.abs(this.target - this.x) < this.stoppingDistance) {
      this.vx = 0; // Stop moving when within stopping distance
    }

    this.moveAndCollide();
  }
  radialSight() {
    const player = this.game.player;

    if (this.game.collision.checkCollision(this, player, "radial", 200)) {
      this.seenPlayer = true; // Enemy sees the player
      this.target = player.x + player.width / 2; // Update target to follow the player
      this.facing = this.target > this.x ? 1 : -1; // Update facing direction

      
    } else {
      this.seenPlayer = false; // Enemy loses sight of the player
    }
  }
  generateTarget() {
    // Generate a new target position based on the current facing direction
    return this.facing > 0
      ? this.x + Math.floor(Math.random() * 400) + 50
      : this.x - Math.floor(Math.random() * 400) - 50;
  }
  castToTarget() {
    const collision = this.game.collision;
    const collisionObjects = this.game.level.collision;

    // Simulate a raycast by checking for obstacles between the enemy and the target
    const step = this.facing > 0 ? 1 : -1; // Step direction based on facing
    let currentX = this.x;

    while (
      (step > 0 && currentX < this.target) ||
      (step < 0 && currentX > this.target)
    ) {
      currentX += step;

      for (let rect of collisionObjects.rects) {
        if (collision.checkPointCollision(currentX, this.y, rect)) {
          return false; // Target is blocked
        }
      }
    }

    return true; // Target is reachable
  }
  moveAndCollide() {
    const collision = this.game.collision;
    const collisionObjects = this.game.level.collision;

    //==========================================
    // HORIZONTAL COLLISION
    //==========================================
    this.x += this.vx * this.game.delta;
    Object.entries(collisionObjects).forEach(([type, objects]) => {
      switch (type) {
        case "rects":
          for (let rect of objects) {
            if (collision.checkCollision(this, rect, "rect")) {
              if (this.vx > 0) {
                // Moving right, hit left side of rect
                const enemyRight = this.x + this.width;
                const rectLeft = rect.x;

                if (enemyRight > rectLeft) {
                  this.x = rectLeft - this.width; // Align enemies's right side to rect's left side
                  this.vx = 0; // Stop horizontal movement
                }
              } else if (this.vx < 0) {
                // Moving left, hit right side of rect
                const enemyLeft = this.x;
                const rectRight = rect.x + rect.width;

                if (enemyLeft < rectRight) {
                  this.x = rectRight; // Align enemies's left side to rect's right side
                  this.vx = 0; // Stop horizontal movement
                }
              }
            }
          }
          break;
      }
    });

    //==========================================
    // VERTICAL
    //==========================================
    this.y += this.vy * this.game.delta;
    Object.entries(collisionObjects).forEach(([type, objects]) => {
      switch (type) {
        case "rects":
          for (let rect of objects) {
            if (collision.checkCollision(this, rect, "rect")) {
              if (this.vy > 0) {
                // Falling, check if hitting the top of the platform
                const enemyBottomBefore =
                  this.y - this.vy * this.game.delta + this.height;
                if (enemyBottomBefore <= rect.y) {
                  this.y = rect.y - this.height; // Align enemy to the top of the platform
                  this.vy = 0; // Stop vertical velocity
                }
              } else if (this.vy < 0) {
                // Jumping, check if hitting the bottom of the platform
                this.y = rect.y + rect.height;
                this.vy = 0; // Stop upward velocity
              }
            }
          }
      }
    });
  }
}
