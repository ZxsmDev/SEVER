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
};
