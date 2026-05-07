export default class CombatManager {
  constructor(gameManager) {
    this.game = gameManager;
    document.addEventListener("click", () => this.attack());
  }
  attack() {
    
  }
}
