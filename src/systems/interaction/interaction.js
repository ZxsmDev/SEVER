export default class Interaction {
  constructor(gameManager) {
    this.game = gameManager;
    this.interactables = [];
    this.hover = null; // { text, worldX, worldY, interactable }
  }
  addInteractable(interactable, interactionType) {
    this.interactables.push({ interactable, interactionType });
  }
  update() {
    const player = this.game.player;

    // Reset hover each frame; render will draw it in the UI pass
    this.hover = null;

    this.interactables.forEach(({ interactable, interactionType }) => {
      if (
        this.game.collision.checkCollision(player, interactable, "radial", 75)
      ) {
        // Store hover data (world coordinates). Render will convert to screen coords.
        if (!interactable.interacted) {
          this.hover = {
            text: "[E] to interact",
            worldX: this.game.player.x - this.game.player.width,
            worldY: this.game.player.y - this.game.player.height / 2,
            interactable,
          };
        }

        if (this.game.input.isPressed("KeyE")) {
          interactable.action(interactionType);
          this.game.level.removeInteractable(interactable);
        }
      }
    });
  }

  render() {
    if (!this.hover) return;
    const ctx = this.game.ctx;
    const cam = this.game.camera;

    // Convert world -> screen coords since UI render happens after camera transform reset
    const screenX = this.hover.worldX - cam.x;
    const screenY = this.hover.worldY - cam.y;

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(
      screenX - 10,
      screenY - 18,
      ctx.measureText(this.hover.text).width + 20,
      24,
    );
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(this.hover.text, screenX, screenY);
  }
}
