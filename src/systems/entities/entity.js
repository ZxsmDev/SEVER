export default class Entity {
  constructor(gameManager, x, y, width, height) {
    this.game = gameManager;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
  }
  update() {
    this.x += this.vx * this.game.delta;
    this.y += this.vy * this.game.delta;
  }
  damage(amount) {
    if (this.combat.health - amount <= 0) {
      this.combat.dead = true;
      let currentEntityIndex =
        this.game.entityManager.characterEntities.indexOf(this);
      if (currentEntityIndex == this.game.player) {
        console.log("Player is dead");
        return;
      }
      console.log(`Entity died`);

      const index = currentEntityIndex;
      if (index !== -1) {
        this.game.entityManager.characterEntities.splice(index, 1);
      }
      return;
    }

    this.combat.health -= amount;
  }
  render() {}
}
