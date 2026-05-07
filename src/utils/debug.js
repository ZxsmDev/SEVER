export default class Debug {
  constructor(gameManager) {
    this.game = gameManager;
    this.on = true;

    this.debugInfo = {
      global: {
        fps: [
          "FPS:",
          () =>
            Math.round(1000 / (performance.now() - this.lastFrameTime || 16)),
        ],
        state: ["State:", () => this.game.stateManager.current.name],
      },
      level: {
        uuid: ["UUID:", () => this.game.level.data.id],
        geometryCount: [
          "Geometry Objects:",
          () => this.game.level.geometry.length,
        ],
        enemyCount: [
          "Enemy Count:",
          () => this.game.entityManager.characterEntities.length - 1,
        ],
      },
      player: {
        x: ["Player X:", () => this.game.player.x.toFixed(2)],
        y: ["Player Y:", () => this.game.player.y.toFixed(2)],
        vx: ["Velocity X:", () => this.game.player.vx.toFixed(3)],
        vy: ["Velocity Y:", () => this.game.player.vy.toFixed(3)],
        speed: ["Speed:", () => this.game.player.speed.toFixed(3)],
        facing: [
          "Facing:",
          () => (this.game.player.facingX === 1 ? "Right" : "Left"),
        ],
        dash: ["Dash:", () => !this.game.player.dash.justDashed],
        doubleJump: ["Double Jump:", () => !this.game.player.doubleJump.used],
        grounded: ["Grounded:", () => this.game.player.grounded],
        combatType: ["Combat Type:", () => this.game.player.combat.currentType],
        attacking: ["Attacking:", () => this.game.player.combat.attacking],
      },
    };
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
    let yOffset = 30;

    for (const category in this.debugInfo) {
      const info = this.debugInfo[category];
      yOffset += 10;
      for (const key in info) {
        const [label, valueFunc] = info[key];
        const value = valueFunc();
        const text = `${label} ${value}`;
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(text, 20, yOffset);
        yOffset += 20;
      }
    }

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
    // VELOCITY VECTOR (current)
    // ==============================
    const startX = player.x + player.width / 2;
    const startY = player.y + player.height / 2;
    const scale = 0.1;
    const dx = player.vx * scale;
    const dy = player.vy * scale;
    const endX = startX + dx;
    const endY = startY + dy;

    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrowhead
    const arrowHeadSize = 10;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowHeadSize * Math.cos(angle - Math.PI / 6),
      endY - arrowHeadSize * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      endX - arrowHeadSize * Math.cos(angle + Math.PI / 6),
      endY - arrowHeadSize * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 255, 0, 0.7)";
    ctx.fill();

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
    // ATTACK BOX
    // ==============================
    if (player.combat.attacking && player.combat.currentType == "melee") {
      ctx.fillStyle = "rgba(255, 100, 100, 0.3)";

      // HORIZONTAL ATTACKS
      ctx.fillRect(
        player.combat.melee.dir == 1
          ? player.x + 20 + player.width
          : player.x -
              player.width * 2 * player.combat.melee.attackDistance -
              20,
        player.y - 10,
        player.height * player.combat.melee.attackDistance,
        player.width + player.height / 2 + 20,
      );
    }
  }
  drawDebugEnemies() {
    const ctx = this.game.ctx;

    this.game.entityManager.characterEntities.forEach((enemy) => {
      // Player is last index in entities, don't draw debug
      if (enemy == this.game.player) return;
      // ==============================
      // VELOCITY VECTOR (current)
      // ==============================
      ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      ctx.lineTo(
        enemy.x + enemy.width / 2 + enemy.vx * 0.1,
        enemy.y + enemy.height / 2 + enemy.vy * 0.1,
      );
      ctx.stroke();

      // ==============================
      // TARGET POSITION
      // ==============================
      ctx.fillStyle = "rgba(255, 230, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(enemy.target, enemy.y + enemy.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();

      // ==============================
      // RADIAL SIGHT
      // ==============================
      ctx.fillStyle = "rgba(0, 162, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(
        enemy.x + enemy.width / 2,
        enemy.y + enemy.height / 2,
        400,
        0,
        2 * Math.PI,
      );
      ctx.fill();

      // ==============================
      // DEBUG TEXT
      // ==============================
      const text = enemy.seenPlayer ? "Moving to Attack" : "Patrolling";

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(
        enemy.x - (ctx.measureText(text).width + 20) / 2 + enemy.width / 2,
        enemy.y - 60,
        ctx.measureText(text).width + 20,
        24,
      );
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(
        text,
        enemy.x - (ctx.measureText(text).width + 20) / 2 + enemy.width / 2 + 10,
        enemy.y - 42.5,
      );
    });
  }
  drawHitboxes() {}
}
