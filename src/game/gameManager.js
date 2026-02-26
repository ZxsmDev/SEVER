export default class GameManager {
  constructor(
    canvas, // HTMLCanvasElement
    ctx, // CanvasRenderingContext2D
    collision, // Collision system (utils/collision.js)
    mathUtils, // Math utilities (utils/math.js)
    inputHandler, // Input handler (utils/input.js)
    debug, // Debug utilities (utils/debug.js)
    gameLoop, // Game loop system, just handles timing and calls update/render in state manager
    stateManager, // State manager system, handles game states and transitions, calls update/render on current state
    entityManager, // Entity manager system, handles all entities and their updates/renders
    PlayerClass, // Player class, represents the player entity, global reference for player-specific logic
    CombatManager, // Combat manager system, handles combat logic, damage calculations, and combat interactions
    LevelClass, // Level class, represents the current level, holds level data and geometry, handles level-specific logic
    Interaction, // Interaction system, handles player interactions with the environment and entities
    Camera, // Camera system, handles view transformations, follows player, and manages rendering offsets
    UserInterface, // User interface system, handles UI elements, HUD, and player feedback
  ) {
    // Canvas and Context
    this.canvas = canvas;
    this.ctx = ctx;
    this.resizeCanvas();

    // Systems
    this.stateManager = new stateManager(this);
    this.gameLoop = new gameLoop(this);

    // Interaction
    this.interaction = new Interaction(this);

    // Level
    this.level = new LevelClass(this);

    // Entities
    this.PlayerClass = PlayerClass;
    this.player = null;
    this.entityManager = new entityManager(this);

    // Combat
    this.combatManager = new CombatManager(this);

    // Camera
    this.camera = new Camera(this);

    // User Interface
    this.ui = new UserInterface(this);

    // Utils
    this.collision = collision;
    this.math = mathUtils;
    this.input = new inputHandler();
    this.debug = new debug(this);

    // Global properties
    this.width = canvas.width;
    this.height = canvas.height;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.delta = null;
  }
  init() {
    // In gameManager.js init(), before line 76:
    this.level.load(1); // Load first level by default

    if (this.stateManager.current.name == "MENU") {
      const levelSelect = document.getElementById("levelSelect");
      if (levelSelect) {
        levelSelect.addEventListener("change", (e) => {
          const selectedLevel = e.target.value;
          this.level.load(selectedLevel);
        });
      }
    }

    // Initialize the player after level data is loaded
    const spawn = this.level.data.geometry.find(
      (obj) => obj.type === "playerSpawn",
    );

    this.player = new this.PlayerClass(
      this,
      spawn.x,
      spawn.y,
      25, // Default width
      50, // Default height
    );

    this.entityManager.entities.push(this.player);

    this.camera.setTarget(this.player);

    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";
    this.stateManager.changeState(this.stateManager.states.menu);
    this.gameLoop.start();
  }
  resizeCanvas() {
    const displayWidth = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;

    // Check if canvas needs to be resized
    if (
      this.canvas.width !== displayWidth ||
      this.canvas.height !== displayHeight
    ) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;

      this.width = this.canvas.width;
      this.height = this.canvas.height;

      // Update Center
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
    }
  }
}
