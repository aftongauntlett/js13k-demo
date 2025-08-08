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

    // Click handler for level progression/restart
    this.canvas.addEventListener("click", () => {
      let timeLeft = Math.max(0, this.orbitals.levelTime - this.orbitals.time);
      if (this.orbitals.checkCompletion()) {
        this.orbitals.nextLevel();
        this.spawnElectrons();
      } else if (timeLeft <= 0) {
        this.orbitals.resetLevel();
        this.spawnElectrons();
      }
    });

    this.gameLoop();
  }

  spawnElectrons() {
    this.electrons = [];

    let blueCount = this.orbitals.orbitals.filter(
      (o) => o.type === "blue"
    ).length;
    let orangeCount = this.orbitals.orbitals.filter(
      (o) => o.type === "orange"
    ).length;

    for (let i = 0; i < blueCount; i++) {
      this.electrons.push(
        new Electron(Math.random() * 700 + 50, Math.random() * 500 + 50, "blue")
      );
    }

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
    this.orbitals.update();

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

    this.orbitals.draw(this.ctx);

    for (let electron of this.electrons) {
      electron.draw(this.ctx);
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
