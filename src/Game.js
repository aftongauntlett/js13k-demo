// Simple atomic physics game
class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 600;

    // Systems
    this.input = new InputSystem(this.canvas);
    this.orbitals = new OrbitalSystem(this.canvas);

    // Electrons
    this.electrons = [];
    this.spawnElectrons();

    // Mouse click to advance levels
    this.canvas.addEventListener("click", () => {
      if (this.orbitals.checkCompletion()) {
        this.orbitals.nextLevel();
        this.spawnElectrons();
      }
    });

    this.gameLoop();
  }

  spawnElectrons() {
    this.electrons = [];

    // Count how many of each type we need
    const blueCount = this.orbitals.orbitals.filter(
      (o) => o.type === "blue"
    ).length;
    const orangeCount = this.orbitals.orbitals.filter(
      (o) => o.type === "orange"
    ).length;

    // Spawn blue electrons
    for (let i = 0; i < blueCount; i++) {
      this.electrons.push(
        new Electron(Math.random() * 700 + 50, Math.random() * 500 + 50, "blue")
      );
    }

    // Spawn orange electrons
    for (let i = 0; i < orangeCount; i++) {
      this.electrons.push(
        new Electron(
          Math.random() * 700 + 50,
          Math.random() * 500 + 50,
          "orange"
        )
      );
    }
  }

  update() {
    for (let electron of this.electrons) {
      electron.update(
        this.input.mouse.x,
        this.input.mouse.y,
        this.orbitals.orbitals
      );
    }
  }
  draw() {
    // Clear canvas
    this.ctx.fillStyle = "rgb(10, 10, 20)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw systems
    this.orbitals.draw(this.ctx);

    for (let electron of this.electrons) {
      electron.draw(this.ctx);
    }

    // Instructions
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      "Orange electrons repel from mouse, blue attract | Match colors to orbitals",
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
