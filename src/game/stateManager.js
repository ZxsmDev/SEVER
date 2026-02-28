export default class StateManager {
  constructor(gameManager) {
    this.game = gameManager;
    this.states = {
      menu: {
        name: "MENU",
        update: () => {},
        render: () => {
          const startButton = document.getElementById("startButton");
          const menu = document.querySelector("section#menu");
          if (startButton) {
            startButton.addEventListener("click", () => {
              this.changeState(this.states.game);
              menu.style.display = "none";
            });
          }
        },
      },
      game: {
        name: "RUNNING",
        update: () => {
          this.game.level.update(); // Update level (entities, interactions, collision objects)
          this.game.camera.update(this.game.ctx); // Update camera position based on player
          this.game.interaction.update(); // Update interactables (e.g. doors, switches) after level update for correct state
        },
        render: () => {
          document.querySelector("section#menu").style.display = "none"

          this.game.camera.applyTransform(this.game.ctx); // Apply camera transform before rendering world
          this.game.level.renderGeometry(); // Draw level geometry (collision objects)
          this.game.level.renderEntities(); // Draw entities (player, enemies, projectiles)
          this.game.debug.render(); // Draw trajectory in world space before reset

          // Reset transform for UI overlay
          this.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
          this.game.debug.renderText();
          this.game.ui.render();
        },
      },
      pause: {
        name: "PAUSED",
        update: () => {
          // Update pause state
        },
        render: () => {
          // Render pause state
        },
      },
    };
    this.current = this.states.game;
  }
  changeState(state) {
    if (this.current?.exit) this.current.exit();
    this.current = state;
    if (this.current?.enter) this.current.enter();
  }

  update() {
    this.current?.update();
    this.game.input.update();
  }
  render() {
    this.game.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
    this.current?.render();
  }
}
