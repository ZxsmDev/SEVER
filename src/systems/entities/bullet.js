import Entity from "./entity.js";

export default class Bullet extends Entity {
  constructor(gameManager, x, y, width, height) {
    super(gameManager, x, y, width, height);
    this.lifeTime = 2; // Seconds
    this.damage = 10;
    this.destroyed = false;
  }
  render() {
    const ctx = this.game.ctx;
    ctx.fillStyle = "rgb(175, 0, 0)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    if (this.destroyed) return;
    // Destroy if well outside camera bounds
    const cam = this.game.camera;
    const margin = 100;
    if (
      this.x < cam.x - margin ||
      this.x > cam.x + cam.width + margin ||
      this.y < cam.y - margin ||
      this.y > cam.y + cam.height + margin
    ) {
      this.destroy();
      return;
    }
    
    super.update();
    this.lifeTime -= this.game.delta;

    // Remove after time expires
    if (this.lifeTime <= 0) {
      this.destroy();
      return;
    }

    // Collision with enemies
    this.game.entityManager.characterEntities.forEach((entity) => {
      if (this.destroyed) return;
      if (entity === this.game.player) return;
      if (this.game.collision.checkCollision(this, entity)) {
        if (entity.damage) {
          entity.damage(this.damage);
        }
        this.destroy();
      }
    });

    this.moveAndCollide();
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
              this.destroy(); // Destroy bullet on horizontal collision with rect
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
              this.destroy(); // Destroy bullet on vertical collision with rect
            }
          }
      }
    });
  }
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const index = this.game.entityManager.entities.indexOf(this);
    if (index !== -1) {
      this.game.entityManager.entities.splice(index, 1);
    }
  }
}
