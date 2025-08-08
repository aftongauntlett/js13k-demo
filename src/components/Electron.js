// Electron particle with quantum field effects
class Electron {
  constructor(canvas, colors) {
    this.canvas = canvas;
    this.colors = colors;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 1.5 + 1;
    this.brightness = Math.random() * 0.4 + 0.3;
    this.phase = Math.random() * Math.PI * 2;
    this.color =
      Math.random() > 0.7
        ? colors.warm // High-energy orange
        : Math.random() > 0.4
        ? colors.glow // Electromagnetic field blue
        : colors.accent; // Standard electron blue

    // Quantum field fluctuations around each electron
    this.quantumFields = [];
    for (let i = 0; i < 6; i++) {
      this.quantumFields.push({
        angle: ((Math.PI * 2) / 6) * i,
        distance: Math.random() * 15 + 10,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
        brightness: Math.random() * 0.6 + 0.2,
      });
    }
  }

  update(mouse) {
    // Quantum motion with uncertainty
    this.x += this.vx;
    this.y += this.vy;

    // Mouse interaction - electrons respond to electromagnetic fields
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      // Close range - electromagnetic repulsion
      const force = (100 - distance) / 1000;
      this.vx -= (dx / distance) * force;
      this.vy -= (dy / distance) * force;
    } else if (distance < 200) {
      // Medium range - electromagnetic attraction
      const force = 0.0005;
      this.vx += (dx / distance) * force;
      this.vy += (dy / distance) * force;
    }

    // Apply velocity damping (energy loss)
    this.vx *= 0.995;
    this.vy *= 0.995;

    // Keep electrons within bounds with periodic boundary conditions
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;

    // Update quantum field fluctuations
    this.quantumFields.forEach((field) => {
      field.phase += field.speed;
      field.angle += 0.005; // Slow orbital rotation
    });

    // Update brightness phase for quantum uncertainty
    this.phase += 0.02;
  }

  draw(ctx) {
    ctx.save();

    // Draw quantum field fluctuations first (behind electron)
    this.quantumFields.forEach((field) => {
      const fieldAlpha = Math.sin(field.phase) * 0.5 + 0.5;
      const fieldX = this.x + Math.cos(field.angle) * field.distance;
      const fieldY = this.y + Math.sin(field.angle) * field.distance;

      ctx.globalAlpha = fieldAlpha * field.brightness * 0.4;
      ctx.fillStyle = `rgb(${this.colors.quantum})`; // Quantum field color
      ctx.beginPath();
      ctx.arc(fieldX, fieldY, 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Main electron core with quantum uncertainty
    const coreAlpha = Math.sin(this.phase) * 0.2 + 0.8;
    ctx.globalAlpha = coreAlpha * this.brightness;

    // Electron energy glow
    const glowGradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 4
    );
    glowGradient.addColorStop(0, `rgba(${this.color}, 1)`);
    glowGradient.addColorStop(0.5, `rgba(${this.color}, 0.3)`);
    glowGradient.addColorStop(1, `rgba(${this.color}, 0)`);

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Electron core
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgb(${this.color})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Check if electron is within an orbital shell
  isInTarget(target, radius) {
    const dx = this.x - target.x;
    const dy = this.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= radius;
  }

  // Apply quantum tunneling effect (for gameplay)
  quantumTunnel(probability = 0.001) {
    if (Math.random() < probability) {
      // Quantum tunneling - electron can "teleport" short distances
      this.x += (Math.random() - 0.5) * 50;
      this.y += (Math.random() - 0.5) * 50;

      // Keep in bounds
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }
  }

  // Apply energy state transition
  exciteToHigherState() {
    this.size *= 1.1;
    this.brightness = Math.min(1, this.brightness * 1.2);
    this.color = this.colors.warm; // High-energy state
  }

  relaxToGroundState() {
    this.size *= 0.95;
    this.brightness *= 0.9;
    this.color = this.colors.accent; // Ground state
  }
}
