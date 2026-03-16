export default class Debug {
  constructor(gameManager) {
    this.game = gameManager;
    this.on = true;
  }
  toggle() {
    this.on = !this.on;
  }
  render() {
    if (!this.on) return;
    this.drawDebugPlayer();
    this.drawDebugEnemies();
    this.drawHitboxes();
  }
  renderText() {
    if (!this.on) return;
    const ctx = this.game.ctx;

    ctx.fillStyle = "white";
    ctx.fillText(
      "FPS: " +
        Math.round(1000 / (performance.now() - this.lastFrameTime || 16)),
      15,
      30
    );
    ctx.fillText("Game State: " + this.game.stateManager.current.name, 15, 50);
    ctx.fillText(
      "Canvas Size: " + this.game.width + " x " + this.game.height,
      15,
      70
    );
    ctx.fillText("Center X: " + this.game.centerX.toFixed(2), 15, 90);
    ctx.fillText("Center Y: " + this.game.centerY.toFixed(2), 15, 110);

    ctx.fillText("PLAYER", 15, 150);
    ctx.fillText("Player X: " + this.game.player.x.toFixed(2), 15, 170);
    ctx.fillText("Player Y: " + this.game.player.y.toFixed(2), 15, 190);
    ctx.fillText("Velocity X: " + this.game.player.vx.toFixed(3), 15, 210);
    ctx.fillText("Velocity Y: " + this.game.player.vy.toFixed(3), 15, 230);
    ctx.fillText("Speed: " + this.game.player.speed.toFixed(3), 15, 250);
    ctx.fillText("Grounded: " + this.game.player.grounded, 15, 270);
    ctx.fillText("Double Jump: " + !this.game.player.doubleJump.used, 15, 290);
    ctx.fillText("Dash: " + !this.game.player.dash.justDashed, 15, 310);

    ctx.fillText("LEVEL", 15, 350);
    ctx.fillText("ID: " + this.game.level.data.id, 15, 370);
    ctx.fillText("Name: " + this.game.level.data.debug.name, 15, 390);
    ctx.fillText(
      "Geometry Objects: " + this.game.level.geometry.length,
      15,
      410
    );
    ctx.fillText(
      "Size: " +
        this.game.level.data.size.width +
        " x " +
        this.game.level.data.size.height,
      15,
      430
    );

    this.lastFrameTime = performance.now();
  }
  drawDebugPlayer() {
    const player = this.game.player;
    const ctx = this.game.ctx;

    const dashEndX =
      player.dash.startX + player.dash.dirX * player.dash.distance;
    const dashEndY =
      player.dash.startY + player.dash.dirY * player.dash.distance;

    // ==============================
    // Velocity Vector (current)
    // ==============================
    ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y + player.height / 2);
    ctx.lineTo(
      player.x + player.width / 2 + player.vx * 0.1,
      player.y + player.height / 2 + player.vy * 0.1
    );
    ctx.stroke();

    // ==============================
    // DASH GHOST (static endpoint)
    // ==============================
    if (player.dash.isDashing && !player.grounded) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(dashEndX, dashEndY, player.width, player.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y + player.height / 2);
      ctx.lineTo(dashEndX + player.width / 2, dashEndY + player.height / 2);
      ctx.stroke();
    }

    // ==============================
    // ATTACK BOX (static endpoint)
    // ==============================
    if (this.combat.attacking) {
      this.game.ctx.fillStyle = "rgba(200, 100, 255, 0.5)";

      // HORIZONTAL ATTACKS
      this.game.ctx.fillRect(
        this.combat.melee.dir == 1
          ? this.x + 20 + this.width
          : this.x - this.width * 2 * this.combat.melee.attackDistance - 20,
        this.y - 10,
        this.height * this.combat.melee.attackDistance,
        this.width + this.height / 2 + 20
      );
    }
  }
  drawDebugEnemies() {
    const ctx = this.game.ctx;

    this.game.entityManager.entities.forEach((enemy) => {
      // Player is last index in entities, don't draw debug
      if (
        enemy ==
        this.game.entityManager.entities[
          this.game.entityManager.entities.length - 1
        ]
      )
        return;
      // ==============================
      // Velocity Vector (current)
      // ==============================
      ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      ctx.lineTo(
        enemy.x + enemy.width / 2 + enemy.vx * 0.1,
        enemy.y + enemy.height / 2 + enemy.vy * 0.1
      );
      ctx.stroke();

      // ==============================
      // Target Position
      // ==============================
      ctx.fillStyle = "rgba(255, 230, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(enemy.target, enemy.y + enemy.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();

      // ==============================
      // Radial Sight
      // ==============================
      ctx.fillStyle = "rgba(0, 162, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(
        enemy.x + enemy.width / 2,
        enemy.y + enemy.height / 2,
        400,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // ==============================
      // Debug Text
      // ==============================
      const text = enemy.seenPlayer ? "Moving to Attack" : "Patrolling";

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(
        enemy.x - (ctx.measureText(text).width + 20) / 2 + enemy.width / 2,
        enemy.y - 30,
        ctx.measureText(text).width + 20,
        24
      );
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(
        text,
        enemy.x - (ctx.measureText(text).width + 20) / 2 + enemy.width / 2 + 10,
        enemy.y - 12.5
      );
    });
  }
  drawHitboxes() {}
}
