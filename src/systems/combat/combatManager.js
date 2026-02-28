export default class CombatManager {
  constructor(gameManager) {
    this.game = gameManager;
    this.enemies = [];
    document.addEventListener("click", e => this.playerAttack(e));
  }
  playerAttack(e) {
    if (this.game.player) {
      // this.game.player.meleeAttack();
      this.game.player.rangedAttack(e);
    }
  }
}
