export default class EntityManager {
  constructor(gameManager) {
    this.game = gameManager;

    this.characterEntities = [];
    this.entities = [];
  }
  update() {
    [...this.characterEntities].forEach((e, index) => {
      if (e && typeof e.update === "function") {
        e.update();
      } else {
        console.warn(
          `Entity at index ${index} is invalid and will be skipped:`,
          e,
        );
      }
    });
    [...this.entities].forEach((e, index) => {
      if (e && typeof e.update === "function") {
        e.update();
      } else {
        console.warn(
          `Entity at index ${index} is invalid and will be skipped:`,
          e,
        );
      }
    });
  }
  render() {
    [...this.characterEntities].forEach((e, index) => {
      if (e && typeof e.render === "function") {
        e.render();
      } else {
        console.warn(
          `Entity at index ${index} is invalid and will be skipped:`,
          e,
        );
      }
    });
    [...this.entities].forEach((e, index) => {
      if (e && typeof e.render === "function") {
        e.render();
      } else {
        console.warn(
          `Entity at index ${index} is invalid and will be skipped:`,
          e,
        );
      }
    });
  }
  addCharacterEntity(entity) {
    this.characterEntities.push(entity);
  }
  addEntity(entity) {
    this.entities.push(entity);
  }
}
