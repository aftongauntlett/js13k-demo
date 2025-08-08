// Firefly particle with sparkle effects
class Firefly {
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
        ? colors.warm
        : Math.random() > 0.4
        ? colors.glow
        : colors.accent;

    // Sparkle particles around each firefly
    this.sparkles = [];
    for (let i = 0; i < 6; i++) {
      this.sparkles.push({
        angle: ((Math.PI * 2) / 6) * i,
        distance: Math.random() * 15 + 10,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
        brightness: Math.random() * 0.6 + 0.2,
      });
    }
  }

  update(mouse) {
    // Gentle floating movement
    this.x += this.vx;
    this.y += this.vy;

    // Mouse interaction - fireflies are attracted but also repelled at close range
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      // Close range - gentle repulsion
      const force = (100 - distance) / 1000;
      this.vx -= (dx / distance) * force;
      this.vy -= (dy / distance) * force;
    } else if (distance < 200) {
      // Medium range - gentle attraction
      const force = 0.0005;
      this.vx += (dx / distance) * force;
      this.vy += (dy / distance) * force;
    }

    // Limit velocity
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Wrap around edges
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;

    // Update pulsing phase
    this.phase += 0.02;

    // Update sparkle particles
    this.sparkles.forEach((sparkle) => {
      sparkle.phase += sparkle.speed;
      sparkle.angle += 0.005; // Slow rotation
    });
  }

  draw(ctx) {
    const pulse = Math.sin(this.phase) * 0.3 + 0.7;
    const alpha = this.brightness * pulse;

    ctx.save();

    // Draw sparkle particles first (behind firefly)
    this.sparkles.forEach((sparkle) => {
      const sparkleAlpha = Math.sin(sparkle.phase) * 0.5 + 0.5;
      const sparkleX = this.x + Math.cos(sparkle.angle) * sparkle.distance;
      const sparkleY = this.y + Math.sin(sparkle.angle) * sparkle.distance;

      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = `rgba(255, 255, 255, ${
        sparkleAlpha * sparkle.brightness * 0.4
      })`;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Tiny glow around sparkle
      const sparkleGlow = ctx.createRadialGradient(
        sparkleX,
        sparkleY,
        0,
        sparkleX,
        sparkleY,
        3
      );
      sparkleGlow.addColorStop(
        0,
        `rgba(255, 255, 255, ${sparkleAlpha * 0.2})`
      );
      sparkleGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sparkleGlow;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Outer soft glow
    ctx.globalCompositeOperation = "screen";
    const outerGlow = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 8
    );
    outerGlow.addColorStop(0, `rgba(${this.color}, ${alpha * 0.08})`);
    outerGlow.addColorStop(0.5, `rgba(${this.color}, ${alpha * 0.03})`);
    outerGlow.addColorStop(1, `rgba(${this.color}, 0)`);

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 8, 0, Math.PI * 2);
    ctx.fill();

    // Middle glow
    const middleGlow = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 4
    );
    middleGlow.addColorStop(0, `rgba(${this.color}, ${alpha * 0.15})`);
    middleGlow.addColorStop(0.7, `rgba(${this.color}, ${alpha * 0.05})`);
    middleGlow.addColorStop(1, `rgba(${this.color}, 0)`);

    ctx.fillStyle = middleGlow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.globalCompositeOperation = "lighter";
    const coreGlow = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * pulse * 2
    );
    coreGlow.addColorStop(0, `rgba(${this.color}, ${alpha * 0.4})`);
    coreGlow.addColorStop(0.6, `rgba(${this.color}, ${alpha * 0.2})`);
    coreGlow.addColorStop(1, `rgba(${this.color}, 0)`);

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * pulse * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
