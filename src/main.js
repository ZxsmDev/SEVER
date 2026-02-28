// Main entry point for the game. Initializes the game manager and starts the game loop.
import GameManager from "./game/gameManager.js";
import GameLoop from "./game/gameLoop.js";
import StateManager from "./game/stateManager.js";

// Entity management and player class
import EntityManager from "./systems/entities/entityManager.js";
import Player from "./systems/entities/player.js";

// Combat system
import CombatManager from "./systems/combat/combatManager.js";

// Camera
import Camera from "./systems/camera/camera.js";

// UI
import UserInterface from "./systems/ui/userInterface.js";

// Level management
import Level from "./systems/level/level.js";

// Interaction system
import Interaction from "./systems/interaction/interaction.js";

// Utility classes
import Debug from "./utils/debug.js";
import InputHandler from "./utils/input.js";
import { Collision } from "./utils/collision.js";
import { MathUtils } from "./utils/math.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.tabIndex = 0;
  canvas.focus();

  const gameManager = new GameManager(
    canvas,
    ctx,
    Collision,
    MathUtils,
    InputHandler,
    Debug,
    GameLoop,
    StateManager,
    EntityManager,
    Player,
    CombatManager,
    Level,
    Interaction,
    Camera,
    UserInterface
  );
  gameManager.init();
});
