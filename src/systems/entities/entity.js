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
  render() {}
}
