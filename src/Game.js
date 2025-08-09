// Simple atomic physics game
class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Systems
    this.input = new InputSystem(this.canvas);
    this.orbitals = new OrbitalSystem(this.canvas);

    // Electrons
    this.electrons = [];
    this.spawnElectrons();

    // Background particles for atmosphere
    this.particles = [];
    this.spawnParticles();

    // Click handler for level progression/restart and tip closing
    this.canvas.addEventListener("click", () => {
      // Check if educational tip is showing
      if (this.orbitals.showingTip) {
        this.orbitals.closeTip();
        return;
      }

      let timeLeft = Math.max(0, this.orbitals.levelTime - this.orbitals.time);
      if (this.orbitals.checkCompletion()) {
        this.orbitals.nextLevel();
        this.spawnElectrons();
      } else if (timeLeft <= 0) {
        this.orbitals.resetLevel();
        this.spawnElectrons();
      }
    });

    // Keyboard handler for closing tips with Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.orbitals.showingTip) {
        this.orbitals.closeTip();
      }
    });

    this.gameLoop();
  }

  spawnElectrons() {
    this.electrons = [];

    // Count and spawn electrons for each type
    ["blue", "orange"].forEach((type) => {
      let count = this.orbitals.orbitals.filter((o) => o.type === type).length;
      for (let i = 0; i < count; i++) {
        this.electrons.push(
          new Electron(
            Math.random() * (this.canvas.width - 100) + 50,
            Math.random() * (this.canvas.height - 100) + 50,
            type
          )
        );
      }
    });
  }

  spawnParticles() {
    this.particles = [];
    // Create subtle background particles
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 1.5 + 0.5,
      });
    }
  }

  update() {
    this.orbitals.update();

    // Update particles with subtle drift and twinkling
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.02;

      // Wrap around edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
    }

    for (let electron of this.electrons) {
      electron.update(
        this.input.mouse.x,
        this.input.mouse.y,
        this.orbitals.orbitals,
        this.orbitals
      );
    }
  }

  draw() {
    this.ctx.fillStyle = "rgb(10,10,20)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background particles
    this.ctx.save();
    for (let p of this.particles) {
      let twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(p.phase));
      this.ctx.fillStyle = `rgba(200,220,255,${p.alpha * twinkle})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();

    // Draw cursor glow (only when tip is not showing)
    if (!this.orbitals.showingTip) {
      this.ctx.save();
      this.ctx.shadowColor = "rgba(100,150,255,0.6)";
      this.ctx.shadowBlur = 20;
      this.ctx.fillStyle = "rgba(100,150,255,0.2)";
      this.ctx.beginPath();
      this.ctx.arc(this.input.mouse.x, this.input.mouse.y, 15, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.orbitals.draw(this.ctx);

    // Draw electrons (only when tip is not showing)
    if (!this.orbitals.showingTip) {
      for (let electron of this.electrons) {
        electron.draw(this.ctx);
      }
    }

    this.ctx.fillStyle = "rgba(255,255,255,0.7)";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      "Orange repel, blue attract | Guide electrons through rotating gaps with mouse",
      20,
      this.canvas.height - 20
    );
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}
