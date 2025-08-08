// Rendering system for backgrounds and effects
class Renderer {
  constructor(canvas, ctx, colors) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;
    this.time = 0;
  }

  drawBackground(mouse) {
    // Create radial gradient from center
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) * 0.7
    );

    gradient.addColorStop(0, `rgb(${this.colors.bg3})`);
    gradient.addColorStop(0.4, `rgb(${this.colors.bg2})`);
    gradient.addColorStop(1, `rgb(${this.colors.bg1})`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add subtle mouse-following light
    const mouseGradient = this.ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      150
    );

    mouseGradient.addColorStop(0, `rgba(${this.colors.glow}, 0.05)`);
    mouseGradient.addColorStop(1, `rgba(${this.colors.glow}, 0)`);

    this.ctx.fillStyle = mouseGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCenterGlow() {
    const pulse = Math.sin(this.time * 0.02) * 0.3 + 0.7;

    // Center glow
    this.ctx.save();
    this.ctx.globalCompositeOperation = "screen";

    const centerGlow = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      100 * pulse
    );

    centerGlow.addColorStop(0, `rgba(${this.colors.purple}, 0.3)`);
    centerGlow.addColorStop(0.5, `rgba(${this.colors.accent}, 0.1)`);
    centerGlow.addColorStop(1, `rgba(${this.colors.accent}, 0)`);

    this.ctx.fillStyle = centerGlow;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    this.time++;
  }
}
