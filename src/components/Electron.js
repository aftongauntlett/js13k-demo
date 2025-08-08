// Simple electron with polarity-based physics
class Electron {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.type = type; // 'blue' or 'orange'
    this.radius = 8;
    this.captured = false;
  }

  update(mouseX, mouseY, orbitals) {
    if (this.captured) return;

    // Apply polarity-based force from mouse
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = this.type === "blue" ? -0.15 : 0.15; // Orange repels, blue attracts
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;

      this.vx += forceX;
      this.vy += forceY;
    }

    // Apply friction
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Simple boundary constraints
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    }
    if (this.x > 800 - this.radius) {
      this.x = 800 - this.radius;
      this.vx = -Math.abs(this.vx);
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    }
    if (this.y > 600 - this.radius) {
      this.y = 600 - this.radius;
      this.vy = -Math.abs(this.vy);
    }

    // Check orbital capture
    for (let orbital of orbitals) {
      if (!orbital.occupied && orbital.type === this.type) {
        const orbitalDx = this.x - orbital.x;
        const orbitalDy = this.y - orbital.y;
        const orbitalDistance = Math.sqrt(
          orbitalDx * orbitalDx + orbitalDy * orbitalDy
        );

        if (orbitalDistance < orbital.radius) {
          orbital.occupied = true;
          this.captured = true;
          this.x = orbital.x;
          this.y = orbital.y;
          break;
        }
      }
    }
  }

  draw(ctx) {
    if (this.captured) return;

    ctx.save();

    // Electron glow
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );

    if (this.type === "blue") {
      gradient.addColorStop(0, "rgb(150, 200, 255)");
      gradient.addColorStop(1, "rgb(100, 150, 255)");
    } else {
      gradient.addColorStop(0, "rgb(255, 200, 150)");
      gradient.addColorStop(1, "rgb(255, 150, 100)");
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
