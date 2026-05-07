export default class HUD {
  constructor(gameManager) {
    this.game = gameManager;
    this.font = "20px Roboto";
    this.color = "white";
  }
  render(ctx) {
    ctx.save();
    ctx.font = this.font;
    ctx.fillStyle = this.color;

    const player = this.game.player;
    const healthRatio = player.combat.health / player.combat.maxHealth;

    ctx.fillStyle = "#d65d5d";
    ctx.fillRect(10, this.game.height - 40, this.game.width / 4, 25);
    ctx.fillStyle = "#25c56d";
    ctx.fillRect(
      10,
      this.game.height - 40,
      !player.combat.dead ? (this.game.width / 4) * healthRatio : 0,
      25,
    );
    
    ctx.fillStyle = "white"
    ctx.fillText(player.combat.health, 15, this.game.height - 20);

    ctx.restore();
  }
}
