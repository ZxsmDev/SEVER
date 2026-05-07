export class Rect {
  constructor(x, y, width, height, color = "rgb(0, 0, 0)") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  render(ctx, color = this.color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Ramp {
  constructor(x1, y1, x2, y2, direction, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.direction = direction; // "up" or "down"
    this.color = color;
  }
  getClosestPointOnSegment(circle) {
    let segmentLenSq = (this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2;

    // If ramp is just a point
    if (segmentLenSq === 0) return { x: this.x1, y: this.y1 };

    // Calculate projection t of circle onto line
    let t =
      ((circle.x - this.x1) * (this.x2 - this.x1) +
        (circle.y - this.y1) * (this.y2 - this.y1)) /
      segmentLenSq;

    // Clamp t to 0-1 to stay on the segment
    t = Math.max(0, Math.min(1, t));

    return {
      x: this.x1 + t * (this.x2 - this.x1),
      y: this.y1 + t * (this.y2 - this.y1),
    };
  }
  getYAtX(x) {
    const relativeX = x - this.x;
    const slope = this.height / this.width;
    return this.direction === "up"
      ? this.y + this.height - slope * relativeX
      : this.y + slope * relativeX;
  }
  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.direction === "up") {
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
      ctx.lineTo(this.x2, this.y1);
    } else {
      ctx.moveTo(this.x2, this.y1);
      ctx.lineTo(this.x1, this.y2);
      ctx.lineTo(this.x1, this.y1);
    }
    ctx.closePath();
    ctx.fill();
  }
}

export class Radial {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  render(ctx, color = "rgb(25, 25, 25)") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class Polygon {
  constructor(points) {
    this.points = points; // Array of {x, y} objects
  }
  render(ctx, color = "rgb(25, 25, 25)") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

export class Interactable {
  constructor(x, y, width, height, color) {
    this.x = x; // Center the interactable for radial collision
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    this.interacted = false; // Track if the interactable has been interacted with
  }
  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    if (this.width <= 0) {
      // Example of removing the interactable after interaction
      this.interacted = true;
      return;
    }
    if (this.interacted) {
      this.width -= 5; // Example of changing the interactable after interaction
    }
  }
  action(type) {
    switch (type) {
      case "door":
        this.interacted = true; // Mark as interacted
        break;
      default:
        console.log(`Unknown interaction type: ${type}`);
    }
    setTimeout(() => {
      this.interacted = false; // Reset interaction after a delay
    }, 1000);
  }
}
