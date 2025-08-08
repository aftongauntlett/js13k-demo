// Rendering system for backgrounds and effects
class Renderer {
  constructor(canvas, ctx, colors) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colors = colors;
    this.time = 0;
  }

  drawBackground(mouse) {
    // Dark laboratory/quantum field background
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) * 0.8
    );

    // Deep laboratory colors - dark with subtle energy
    gradient.addColorStop(0, "rgb(8, 12, 20)"); // Very dark center
    gradient.addColorStop(0.4, "rgb(5, 8, 15)"); // Darker
    gradient.addColorStop(1, "rgb(2, 4, 8)"); // Almost black edges

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw quantum field effects
    this.drawQuantumField();

    // Electromagnetic field visualization from mouse
    if (mouse) {
      this.drawElectromagneticField(mouse);
    }
  }

  drawQuantumField() {
    this.ctx.save();

    // Quantum field fluctuations - subtle particle effects
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      // Consistent pseudo-random positions
      const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const y = (Math.sin(i * 78.233) * 43758.5453) % 1;

      const particleX = Math.abs(x) * this.canvas.width;
      const particleY = Math.abs(y) * this.canvas.height;

      // Quantum fluctuation effect
      const fluctuation = Math.sin(this.time * 0.02 + i * 0.5) * 0.3 + 0.7;
      const size = 0.5 + Math.sin(this.time * 0.01 + i) * 0.3;

      // Subtle blue/white quantum particles
      this.ctx.globalAlpha = fluctuation * 0.15;
      this.ctx.fillStyle = `hsl(${200 + Math.sin(i) * 20}, 70%, 80%)`;

      this.ctx.beginPath();
      this.ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Energy field lines - very subtle
    this.ctx.globalAlpha = 0.08;
    this.ctx.strokeStyle = "rgba(100, 150, 255, 0.3)";
    this.ctx.lineWidth = 0.5;

    for (let i = 0; i < 5; i++) {
      const wave = Math.sin(this.time * 0.005 + i) * 20;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.canvas.height * 0.2 + wave + i * 80);
      this.ctx.quadraticCurveTo(
        this.canvas.width * 0.5,
        this.canvas.height * 0.3 + wave * 2 + i * 80,
        this.canvas.width,
        this.canvas.height * 0.2 + wave + i * 80
      );
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  drawElectromagneticField(mouse) {
    this.ctx.save();

    // Electromagnetic field distortion around mouse cursor
    const fieldGradient = this.ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      120
    );

    // Pulsing electromagnetic field
    const fieldStrength = Math.sin(this.time * 0.03) * 0.02 + 0.03;
    fieldGradient.addColorStop(0, `rgba(150, 200, 255, ${fieldStrength})`);
    fieldGradient.addColorStop(
      0.5,
      `rgba(100, 150, 255, ${fieldStrength * 0.5})`
    );
    fieldGradient.addColorStop(1, "rgba(50, 100, 200, 0)");

    this.ctx.fillStyle = fieldGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Field lines radiating from mouse
    this.ctx.globalAlpha = 0.1;
    this.ctx.strokeStyle = "rgba(150, 200, 255, 0.5)";
    this.ctx.lineWidth = 1;

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + this.time * 0.01;
      const length = 60 + Math.sin(this.time * 0.02 + i) * 20;

      this.ctx.beginPath();
      this.ctx.moveTo(mouse.x, mouse.y);
      this.ctx.lineTo(
        mouse.x + Math.cos(angle) * length,
        mouse.y + Math.sin(angle) * length
      );
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    this.time++;
  }
}
