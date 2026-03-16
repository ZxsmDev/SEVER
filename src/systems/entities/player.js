import Entity from "./entity.js";
import BoonUI from "../ui/boonUI.js";

export default class Player extends Entity {
  constructor(gameManager, x, y, width, height) {
    super(gameManager, x, y, width, height); // Call base constructor
    // Reference to game manager for accessing other systems
    this.game = gameManager;

    // Physics properties
    this.speed = 400;
    this.gravity = 800;
    this.jumpStrength = 600;
    this.fallMultiplier = 1.5;
    this.facingX = 1;

    // Dashing properties
    this.dash = {
      canDash: true,
      isDashing: false,
      justDashed: false,
      duration: 0.25,
      timer: 0,
      distance: 300,
      dirX: 0,
      dirY: 0,
      startX: 0,
      startY: 0,
      groundMultiplier: 2,
    };

    // Double jump properties
    this.doubleJump = {
      canDoubleJump: true,
      used: false,
    };

    // Combat
    this.combat = {
      currentType: null,
      ranged: { attackSpeed: 100, attackDistance: 15 },
      melee: { attackSpeed: 300, attackDistance: 1.7, dir: 1 },
      modifiers: {
        damage: 0,
        defense: 0,
        health: 0,
      },
      health: 100,
      defense: 5,
      attacking: false,
    };

    // Flags
    this.grounded = false;
  }
  render() {
    this.game.ctx.fillStyle = "skyblue";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    // Update facing based on the last horizontal key pressed
    if (this.game.input.isPressed(["ArrowLeft", "KeyA"])) this.facingX = -1;
    else if (this.game.input.isPressed(["ArrowRight", "KeyD"]))
      this.facingX = 1;
    //==========================================
    // Dashing - Initiate
    //==========================================
    if (
      this.game.input.isPressed(["ShiftLeft", "ShiftRight"]) &&
      this.dash.canDash
    ) {
      if (!this.grounded && !this.dash.justDashed) {
        // Air dash: determine direction and calculate velocity
        this.dash.justDashed = true;
        this.dash.isDashing = true;
        this.dash.startX = this.x;
        this.dash.startY = this.y;
        this.dash.timer = this.dash.duration;
        this.dash.canDash = false;

        // Determine dash direction
        this.dash.dirX = 0;
        this.dash.dirY = 0;

        if (this.game.input.isDown(["ArrowLeft", "KeyA"])) {
          this.dash.dirX = -1;
        } else if (this.game.input.isDown(["ArrowRight", "KeyD"])) {
          this.dash.dirX = 1;
        }

        if (this.game.input.isDown(["ArrowDown", "KeyS"])) {
          this.dash.dirY = 1;
        } else if (this.dash.dirX === 0) {
          // No horizontal input: dash downwards
          this.dash.dirY = 1;
        }

        // Calculate velocity to cover dashDistance in dashDuration
        // velocity = distance / time
        const dashVelocity = this.dash.distance / this.dash.duration;
        this.vx = this.dash.dirX * dashVelocity;
        this.vy = this.dash.dirY * dashVelocity;
        // Allow dashing again after brief cooldown
        setTimeout(() => (this.dash.canDash = true), 100);
      } else if (this.grounded) {
        // Ground dash: activate sprint mode
        this.dash.isDashing = true;
        this.dash.canDash = false;
        // Allow dashing again after brief cooldown
        setTimeout(() => (this.dash.canDash = true), 100);
      }
    }

    //==========================================
    // Update dash state
    //==========================================
    // Air dash ends when timer expires
    if (this.dash.isDashing && !this.grounded) {
      this.dash.timer -= this.game.delta;
      if (this.dash.timer <= 0) {
        this.dash.isDashing = false;
      }
    }

    // Ground dash ends when Shift released or player goes airborne
    if (
      this.dash.isDashing &&
      this.grounded &&
      !this.game.input.isDown(["ShiftLeft", "ShiftRight"])
    ) {
      this.dash.isDashing = false;
    }

    //==========================================
    // Horizontal movement (only if not air dashing)
    //==========================================
    if (!this.dash.isDashing || this.grounded) {
      let speedMultiplier = 1;
      if (this.dash.isDashing && this.grounded) {
        speedMultiplier = this.dash.groundMultiplier;
      }

      if (this.game.input.isDown(["ArrowLeft", "KeyA"]))
        this.vx = -this.speed * speedMultiplier;
      else if (this.game.input.isDown(["ArrowRight", "KeyD"]))
        this.vx = this.speed * speedMultiplier;
      else this.vx = 0;
    }

    //==========================================
    // Gravity (disabled during air dash).
    // Apply stronger gravity when falling to reduce "floaty" feel.
    //==========================================
    if (!this.grounded && !this.dash.isDashing) {
      const gravityScale = this.vy > 0 ? this.fallMultiplier : 1;
      this.vy += this.gravity * gravityScale * this.game.delta;
    } else if (this.grounded) {
      this.vy = 0;
    }

    //==========================================
    // Jumping
    //==========================================
    if (this.game.input.isPressed(["ArrowUp", "Space"]) && this.grounded) {
      this.vy = this.dash.isDashing
        ? -this.jumpStrength * 1.2
        : -this.jumpStrength;
      this.grounded = false;
      setTimeout(() => (this.doubleJump.delay = 0), 100); // Start double jump delay
    } else if (
      this.game.input.isPressed(["ArrowUp", "Space"]) &&
      !this.grounded &&
      this.doubleJump.canDoubleJump &&
      !this.doubleJump.used &&
      this.doubleJump.delay <= 0
    ) {
      this.vy = -this.jumpStrength;
      this.doubleJump.used = true;
    } else if (this.grounded) {
      this.doubleJump.used = false;
    }

    this.moveAndCollide();

    //==========================================
    // DEBUG
    //==========================================
    if (this.game.input.isPressed(["Backslash", "Backquote"])) {
      this.game.debug.toggle();
    }

    if (this.game.input.isPressed(["B"])) {
      this.debugActivateBoon();
    }
  }
  moveAndCollide() {
    const collision = this.game.collision;
    const collisionObjects = this.game.level.collision;

    //==========================================
    // HORIZONTAL COLLISION
    //==========================================
    this.x += this.vx * this.game.delta;
    Object.entries(collisionObjects).forEach(([type, objects]) => {
      switch (type) {
        case "rects":
          for (let rect of objects) {
            if (collision.checkCollision(this, rect, "rect")) {
              if (this.vx > 0) {
                // Moving right, hit left side of rect
                const playerRight = this.x + this.width;
                const rectLeft = rect.x;

                if (playerRight > rectLeft) {
                  this.x = rectLeft - this.width; // Align player's right side to rect's left side
                  this.vx = 0; // Stop horizontal movement
                }
              } else if (this.vx < 0) {
                // Moving left, hit right side of rect
                const playerLeft = this.x;
                const rectRight = rect.x + rect.width;

                if (playerLeft < rectRight) {
                  this.x = rectRight; // Align player's left side to rect's right side
                  this.vx = 0; // Stop horizontal movement
                }
              }
            }
          }
          break;

        case "ramps":
          for (let ramp of objects) {
            if (collision.checkCollision(this, ramp, "ramp")) {
              // Align player with ramp surface
              const rampY = ramp.getYAtX(this.x + this.width / 2);
              if (this.y + this.height >= rampY) {
                this.y = rampY - this.height; // Align player to ramp surface
                this.grounded = true; // Player is grounded
                this.vy = 0; // Stop vertical velocity
                this.dash.justDashed = false; // Reset dash state
                this.doubleJump.canDoubleJump = true; // Reset double jump
              }
            }
          }
          break;
      }
    });

    //==========================================
    // VERTICAL
    //==========================================
    this.y += this.vy * this.game.delta;
    Object.entries(collisionObjects).forEach(([type, objects]) => {
      switch (type) {
        case "rects":
          for (let rect of objects) {
            if (collision.checkCollision(this, rect, "rect")) {
              if (this.vy > 0) {
                // Falling, check if hitting the top of the platform
                const playerBottomBefore =
                  this.y - this.vy * this.game.delta + this.height;
                if (playerBottomBefore <= rect.y) {
                  this.y = rect.y - this.height; // Align player to the top of the platform
                  this.grounded = true; // Player is grounded
                  this.vy = 0; // Stop vertical velocity
                  this.dash.justDashed = false; // Reset dash state
                  this.doubleJump.canDoubleJump = true; // Reset double jump
                }
              } else if (this.vy < 0) {
                // Jumping, check if hitting the bottom of the platform
                this.y = rect.y + rect.height;
                this.vy = 0; // Stop upward velocity
                this.grounded = false;
              }
            }
          }
      }
    });

    if (this.grounded) {
      this.y += 1;
      let stillGrounded = false;
      Object.entries(collisionObjects).forEach(([type, objects]) => {
        switch (type) {
          case "rects":
            for (let rect of objects) {
              if (collision.checkCollision(this, rect, "rect")) {
                stillGrounded = true;
              }
            }
            break;
          case "ramps":
            for (let ramp of objects) {
              if (collision.checkCollision(this, ramp, "ramp")) {
                stillGrounded = true;
              }
            }
            break;
        }
      });
      this.y -= 1;
      if (!stillGrounded) {
        this.grounded = false;
      }
    }
  }
  meleeAttack() {
    if (this.combat.attacking) return; // Prevent spamming attacks

    if (this.game.input.isDown(["ArrowUp", "KeyW"])) {
      this.combat.melee.dirY = -1;
      this.combat.melee.dirX = 0;
    } else if (this.game.input.isDown(["ArrowDown", "KeyS"])) {
      this.combat.melee.dirY = 1;
      this.combat.melee.dirX = 0;
    } else if (this.game.input.isDown(["ArrowLeft", "KeyA"])) {
      this.combat.melee.dirX = -1;
      this.combat.melee.dirY = 0;
    } else if (this.game.input.isDown(["ArrowRight", "KeyD"])) {
      this.combat.melee.dirX = 1;
      this.combat.melee.dirY = 0;
    } else {
      // Default to facing direction if no input
      this.combat.melee.dirX = this.facingX || 1; // Use last horizontal input as facing
      this.combat.melee.dirY = 0;
    }

    this.combat.attacking = true;
    setTimeout(
      () => (this.combat.attacking = false),
      this.combat.melee.attackSpeed
    ); // Attack duration
  }
  rangedAttack(e) {
    if (this.combat.attacking) return;

    // Get mouse click position
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    this.combat.attacking = true;
    setTimeout(
      () => (this.combat.attacking = false),
      this.combat.ranged.attackSpeed
    );
  }
  // TEMP DEVTOOL
  debugActivateBoon() {
    let bui = new BoonUI();
    bui.render();
  }
}
