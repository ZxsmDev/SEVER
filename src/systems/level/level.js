import testLevel00 from "./data/levelTest00.json" with { type: "json" };
import testLevel01 from "./data/levelTest01.json" with { type: "json" };
import {
  Rect,
  Ramp,
  Radial,
  Polygon,
  Interactable,
} from "./objects/objects.js";
import EnemyClass from "../entities/enemy.js";

export default class Level {
  constructor(gameManager) {
    this.game = gameManager;
    this.levels = [testLevel00, testLevel01];
    this.data = null;
    this.geometry = [];
    this.enemies = [];
    this.collision = {
      rects: [],
      ramps: [],
      radial: [],
      poly: [],
    };

    this.color = {
      ground: "#000000",
      platform: "#3F3F3F",
      door: "#2a527c",
      ramp: "#000000",
    };
  }
  renderGeometry() {
    Object.values(this.collision).forEach((group) => {
      group.forEach((obj) => {
        obj.render(this.game.ctx);
      });
    });
  }
  renderEntities() {
    this.game.entityManager.render();
  }
  removeInteractable(interactable) {
    this.collision.rects = this.collision.rects.filter(
      (r) => r !== interactable,
    );
  }
  update() {
    this.game.interaction.interactables.forEach((interactable) => {
      interactable.interactable.update();
    });
    this.game.entityManager.update();
  }
  load(index) {
    this.data = this.levels[index];
    this.geometry = this.data.geometry;
    this.enemies = this.data.enemies;

    // Create collision rectangles from geometry
    this.geometry.forEach((obj) => {
      switch (obj.type) {
        case "ground":
          const groundRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.ground,
          );
          this.collision.rects.push(groundRect);
          break;
        case "platform":
          const platformRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            (obj.height) / 2,
            this.color.platform,
          );
          this.collision.rects.push(platformRect);
          break;
        case "wall":
          const wallRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.wall,
          );
          this.collision.rects.push(wallRect);
          break;
        case "ramp":
          const ramp = new Ramp(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            obj.slope === 1 ? "up" : "down",
            this.color.ramp,
          );
          this.collision.ramps.push(ramp);
          break;
        case "interactable":
          const interactable = new Interactable(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.door,
          );
          this.game.interaction.addInteractable(interactable, obj.interaction);
          this.collision.rects.push(interactable);
          break;
        case "radial":
          const radial = new Radial(
            obj.x,
            obj.y,
            obj.radius,
            obj.color || "#FF0000",
          );
          // this.collision.radial.push(circle);
          break;
        case "polygon":
          const polygon = new Polygon(obj.points, obj.color || "#00FF00");
          // this.collision.poly.push(polygon);
          break;
      }
    });

    if (!this.enemies) return;
    this.enemies.forEach((enemyData) => {
      const enemy = new EnemyClass(
        this.game,
        enemyData.spawn.x,
        enemyData.spawn.y,
        25, // Default width
        50, // Default height
      );
      this.game.entityManager.addEnemy(enemy);
    });
  }
}
