export const Collision = {
  rectCollision(a, b) {
    // Check if two rectangles overlap
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  },
  rampCollision(a, b) {
    // Get the player's center X position
    const playerCenterX = a.x + a.width / 2;

    // Get the Y position of the ramp at the player's center X
    const rampYAtPlayerX = b.getYAtX(playerCenterX);

    // Check if the player's bottom is on or near the ramp surface
    return (
      a.y + a.height >= rampYAtPlayerX && // Player's bottom is at or below the ramp
      a.y + a.height <= rampYAtPlayerX + 10 && // Allow a small margin for ramp alignment
      playerCenterX >= b.x && // Player is within the ramp's horizontal bounds
      playerCenterX <= b.x + b.width
    );
  },
  radialCollision(a, b) {
    // Calculate the distance between the centers of two circles
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy) < a.r + b.r;
  },
  checkPointCollision(pointX, pointY, rect) {
    // Check if a point (pointX, pointY) is inside a rectangle (rect)
    return (
      pointX >= rect.x &&
      pointX <= rect.x + rect.width &&
      pointY >= rect.y &&
      pointY <= rect.y + rect.height
    );
  },
  checkCollision(refCaller, refTarget, type = "rect", radius = 0) {
    // Determine the type of collision to check
    switch (type) {
      case "rect":
        return this.rectCollision(refCaller, refTarget);
      case "ramp":
        return this.rampCollision(refCaller, refTarget);
      case "radial":
        return this.radialCollision(
          {
            x: refCaller.x + refCaller.width / 2,
            y: refCaller.y + refCaller.height / 2,
            r: radius,
          },
          {
            x: refTarget.x + refTarget.width / 2,
            y: refTarget.y + refTarget.height / 2,
            r: radius,
          }
        );
      default:
        return false;
    }
  },
  moveAndCollide(
    x,
    y,
    vx,
    vy,
    width,
    height,
    delta,
    collisionObjects,
    refCaller,
    isPlayer = false
  ) {
    //==========================================
    // HORIZONTAL
    //==========================================
    x += vx * delta;
    Object.entries(collisionObjects).forEach(([type, objects]) => {
      switch (type) {
        case "rects": // Walls, floor, platforms
          for (let rect of objects) {
            if (this.checkCollision(refCaller, rect, "rect")) {
              if (vx > 0) {
                // Moving right, hit left side of rect
                const callerRight = x + width;
                const rectLeft = rect.x;

                if (callerRight > rectLeft) {
                  x = rectLeft - width; // Align callers right side to rect's left side
                  vx = 0; // Stop horizontal movement
                }
              } else if (vx < 0) {
                // Moving left, hit right side of rect
                const callerLeft = x;
                const rectRight = rect.x + rect.width;

                if (callerLeft < rectRight) {
                  x = rectRight; // Align callers left side to rect's right side
                  vx = 0; // Stop horizontal movement
                }
              }
            }
          }
          break;
        case "ramps":
          for (let ramp of objects) {
            if (this.checkCollision(refCaller, ramp, "ramp")) {
              const rampY = ramp.getYAtX(x + width / 2);
              if (y + height >= rampY) {
                y = rampY - height; // Align caller to ramp surface
                vy = 0; // Stop vertical velocity

                if (isPlayer) {
                  refCaller.grounded = true; // Player is grounded
                  refCaller.dash.justDashed = false; // Reset dash state
                  refCaller.doubleJump.canDoubleJump = true; // Reset double jump
                }
              }
            }
          }
          break;
      }
    });

    //==========================================
    // VERTICAL
    //==========================================
    y += vy * delta;
    Object.entries(collisionObjects).forEach(([type, objects]) => {
      switch (type) {
        case "rects":
          for (let rect of objects) {
            if (this.checkCollision(refCaller, rect, "rect")) {
              if (vy > 0) {
                // Falling, check if hitting the top of the platform
                const callerBottomBefore = y - vy * delta + height;
                if (callerBottomBefore <= rect.y) {
                  y = rect.y - height; // Align caller to the top of the platform
                  vy = 0; // Stop vertical velocity

                  if (isPlayer) {
                    refCaller.grounded = true; // Player is grounded
                    refCaller.dash.justDashed = false; // Reset dash state
                    refCaller.doubleJump.canDoubleJump = true; // Reset double jump
                  }
                }
              } else if (vy < 0) {
                // Jumping, check if hitting the bottom of the platform
                y = rect.y + rect.height;
                vy = 0; // Stop upward velocity

                if (isPlayer) refCaller.grounded = false;
              }
            }
          }
      }
    });

    // Only for player:
    if (isPlayer && refCaller.grounded) {
      y += 1;
      let stillGrounded = false;
      Object.entries(collisionObjects).forEach(([type, objects]) => {
        switch (type) {
          case "rects":
            for (let rect of objects) {
              if (this.checkCollision(refCaller, rect, "rect")) {
                stillGrounded = true;
              }
            }
            break;
          case "ramps":
            for (let ramp of objects) {
              if (this.checkCollision(refCaller, ramp, "ramp")) {
                stillGrounded = true;
              }
            }
            break;
        }
      });
      y -= 1;
      if (!stillGrounded) {
        refCaller.grounded = false;
      }
    }
  },
};
