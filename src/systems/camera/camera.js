export default class Camera {
  constructor(gameManager) {
    this.game = gameManager;
    this.x = 0;
    this.y = 0;
    this.width = gameManager.width;
    this.height = gameManager.height;
    this.followTarget = gameManager.player; // Default to following player
  }
  setTarget(entity) {
    this.followTarget = entity;
  }
  update() {
    // Update camera size in case of window resize
    this.width = this.game.width;
    this.height = this.game.height;

    if (!this.followTarget) return;

    // Center camera on target
    const targetX =
      this.followTarget.x + this.followTarget.width / 2 - this.width / 2;
    const targetY =
      this.followTarget.y + this.followTarget.height / 2 - this.height / 2;

    this.x = this.game.math.lerp(this.x, targetX, 0.3);
    this.y = this.game.math.lerp(this.y, targetY, 0.3);

    // Clamp to level bounds
    const levelWidth = this.game.level.data.size.width;
    const levelHeight = this.game.level.data.size.height;
    this.x = this.game.math.clamp(this.x, 0, levelWidth - this.width);
    this.y = this.game.math.clamp(this.y, 0, levelHeight - this.height);

    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }
  applyTransform(ctx) {
    ctx.setTransform(1, 0, 0, 1, -this.x, -this.y);
  }
}
