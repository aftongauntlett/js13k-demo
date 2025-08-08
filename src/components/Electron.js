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
    this.mouseInfluenced = false;
  }

  update(mouseX, mouseY, orbitals, orbitalSystem) {
    if (this.captured) return;

    let dx = this.x - mouseX,
      dy = this.y - mouseY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Track if mouse is close enough to influence electron
    this.mouseInfluenced = distance < 150;

    if (distance > 0 && this.mouseInfluenced) {
      let force = this.type === "blue" ? -0.15 : 0.15;
      this.vx += (dx / distance) * force;
      this.vy += (dy / distance) * force;
    }

    this.vx *= 0.98;
    this.vy *= 0.98;
    this.x += this.vx;
    this.y += this.vy;

    // Boundaries
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

    // Orbital interactions
    for (let orbital of orbitals) {
      if (orbital.type === this.type) {
        let odx = this.x - orbital.x,
          ody = this.y - orbital.y;
        let odist = Math.sqrt(odx * odx + ody * ody);

        if (odist < orbital.radius + this.radius) {
          if (
            !orbital.occupied &&
            this.mouseInfluenced &&
            orbitalSystem.canEnterOrbital(orbital, this.x, this.y)
          ) {
            orbital.occupied = true;
            this.captured = true;
            this.x = orbital.x;
            this.y = orbital.y;
            break;
          } else if (orbital.rotate && !orbital.occupied) {
            let bounceX = odx / odist,
              bounceY = ody / odist;
            this.vx = bounceX * 3;
            this.vy = bounceY * 3;
            this.x = orbital.x + bounceX * (orbital.radius + this.radius + 2);
            this.y = orbital.y + bounceY * (orbital.radius + this.radius + 2);
          }
        }
      }
    }
  }

  draw(ctx) {
    if (this.captured) return;

    ctx.save();

    // Add subtle glow when mouse-influenced
    if (this.mouseInfluenced) {
      ctx.shadowColor =
        this.type === "blue"
          ? "rgba(100,150,255,0.8)"
          : "rgba(255,150,100,0.8)";
      ctx.shadowBlur = 15;
    }

    let grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );

    if (this.type === "blue") {
      grad.addColorStop(0, "rgb(150,200,255)");
      grad.addColorStop(1, "rgb(100,150,255)");
    } else {
      grad.addColorStop(0, "rgb(255,200,150)");
      grad.addColorStop(1, "rgb(255,150,100)");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
