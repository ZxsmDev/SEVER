import HUD from "./hud.js";
import BoonUI from "./boonUI.js";

export default class UserInterface {
  constructor(gameManager) {
    this.game = gameManager;
    this.hud = new HUD(gameManager);
  }
  render() {
    this.hud.render(this.game.ctx);
    // Render other UI elements here, such as inventory, minimap, etc.
    if (
      this.game.interaction &&
      typeof this.game.interaction.render === "function"
    ) {
      this.game.interaction.render();
    }

    // Render boon UI as HTML elements, not on the canvas, since they need to be interactive
    if (this.game.player.boons.available) {
      const boonUI = new BoonUI(this.game.player.boons.list);
      boonUI.render();
      boonUI.update();
    }
  }
}
