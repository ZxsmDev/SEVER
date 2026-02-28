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
    this.drawTrajectory();
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
  drawTrajectory() {
    return
    const player = this.game.player;
    const ctx = this.game.ctx;

    const steps = 60;
    const stepTime = 0.03;

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

    if (player.dash.isDashing && !player.grounded) {
      // ==============================
      // DASH GHOST (STATIC ENDPOINT)
      // ==============================
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(dashEndX, dashEndY, player.width, player.height);

      // ==============================
      // DASH LINE (current > ghost)
      // ==============================
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y + player.height / 2);
      ctx.lineTo(dashEndX + player.width / 2, dashEndY + player.height / 2);
      ctx.stroke();
    }

    // ==============================
    // NORMAL TRAJECTORY (NO DASH)
    // ==============================
    if (!player.dash.isDashing || player.grounded) {
      let x = player.x;
      let y = player.y;
      let vx = player.vx;
      let vy = player.vy;

      // Build trajectory path and find first collision with interpolation
      let impact = null; // {x, y}
      let impactStep = -1;

      let prevX = x;
      let prevY = y;
      for (let i = 0; i < steps; i++) {
        vy += player.gravity * stepTime;
        const nextX = x + vx * stepTime;
        const nextY = y + vy * stepTime;

        // Check collision with all platforms using swept step
        for (let obj of this.game.level.collision.rects) {
          // Simple AABB overlap at the next step
          if (
            nextX < obj.x + obj.width &&
            nextX + player.width > obj.x &&
            nextY < obj.y + obj.height &&
            nextY + player.height > obj.y
          ) {
            // Prefer top-of-platform hits: check previous bottom vs platform top
            const prevBottom = prevY + player.height;
            const nextBottom = nextY + player.height;
            if (prevBottom <= obj.y && nextBottom >= obj.y) {
              // Interpolate between prev and next to find exact crossing of obj.y
              const t = (obj.y - prevBottom) / (nextBottom - prevBottom || 1);
              const ix = prevX + (nextX - prevX) * t;
              const iy = prevY + (nextY - prevY) * t;
              impact = { x: ix, y: iy };
            } else {
              // Fallback: use next position as impact
              impact = { x: nextX, y: nextY };
            }
            impactStep = i;
            break;
          }
        }
        if (impact) break;

        prevX = nextX;
        prevY = nextY;
        x = nextX;
        y = nextY;
      }

      // Draw trajectory up to collision (or full path)
      x = player.x;
      y = player.y;
      vx = player.vx;
      vy = player.vy;

      ctx.strokeStyle = "rgba(255, 0, 0, 0.7)";
      ctx.beginPath();
      ctx.moveTo(x + player.width / 2, y + player.height / 2);

      const drawSteps = impact ? impactStep + 1 : steps;
      for (let i = 0; i < drawSteps; i++) {
        vy += player.gravity * stepTime;
        x += vx * stepTime;
        y += vy * stepTime;
        ctx.lineTo(x + player.width / 2, y + player.height / 2);
      }

      // If impact exists draw final interpolated point to avoid jitter
      if (impact) {
        ctx.lineTo(impact.x + player.width / 2, impact.y + player.height / 2);
      }

      ctx.stroke();

      // Draw collision indicator at impact
      if (impact) {
        if (vx > 0) {
          // Moving right, hit left side of rect
          impact.x = impact.x - player.width / 2 + 30;
        }
        if (vx < 0) {
          // Moving left, hit right side of rect
          impact.x = impact.x + player.width / 2 - 12;
        }
        if (vx === 0) {
          // Vertical fall, center the impact
          impact.x = impact.x - player.width / 2 + 21;
        }
        ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
        ctx.fillRect(impact.x, impact.y + player.height - 4, 8, 8);
      }
    }
  }

  drawHitboxes(entityManager) {}
}
