// Main game class - Quantum Chaos atomic physics simulation
class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Atomic Physics / Chaos Theory color palette
    this.colors = {
      // Laboratory background - very dark
      bg1: "2, 4, 8", // Almost black
      bg2: "5, 8, 15", // Very dark blue
      bg3: "8, 12, 20", // Dark blue

      // Electron/particle colors
      accent: "100, 150, 255", // Electron blue
      warm: "255, 120, 80", // High-energy orange
      sage: "80, 200, 150", // Quantum green

      // Energy field colors
      purple: "150, 100, 255", // Plasma purple
      glow: "150, 200, 255", // Electromagnetic field
      quantum: "200, 220, 255", // Quantum fluctuation
    };

    // Initialize systems
    this.renderer = new Renderer(this.canvas, this.ctx, this.colors);
    this.input = new InputSystem(this.canvas);
    this.orbitals = new OrbitalSystem(this.canvas, this.colors);

    // Set up pattern change callback
    this.orbitals.onPatternChange = () => {
      this.initializeElectrons();
    };

    // Initialize electrons - adjust count based on current orbital pattern
    this.electrons = [];
    this.initializeElectrons();

    // Set up test controls
    this.setupTestControls();

    console.log(
      "Quantum Chaos initialized! Guide electrons to stable orbital configurations."
    );
  }

  setupTestControls() {
    // N = Next orbital pattern
    this.input.onKey("n", () => {
      this.orbitals.switchToNextPattern();
    });

    // P = Previous orbital pattern
    this.input.onKey("p", () => {
      this.orbitals.switchToPreviousPattern();
    });

    // C = Complete current pattern (for testing)
    this.input.onKey("c", () => {
      this.orbitals.onPatternCompleted();
    });

    // R = Reset to first pattern
    this.input.onKey("r", () => {
      this.orbitals.resetGame();
      this.initializeElectrons(); // Still need this since resetGame doesn't trigger callback
    });
  }

  initializeElectrons() {
    // Clear existing electrons
    this.electrons = [];

    // Create enough electrons for the current orbital pattern (plus some extras for chaos)
    const pattern = this.orbitals.getCurrentPattern();
    // Add extra electrons for complex configurations
    const baseExtra = pattern.name.includes("Neon") ? 5 : 3;
    const electronCount = Math.max(pattern.orbitals.length + baseExtra, 8);

    for (let i = 0; i < electronCount; i++) {
      this.electrons.push(new Electron(this.canvas, this.colors));
    }

    console.log(
      `${pattern.name}: Created ${electronCount} electrons for ${pattern.orbitals.length} orbitals`
    );
  }

  update() {
    const mouse = this.input.getMouse();

    // Update electrons with electromagnetic field interactions
    this.electrons.forEach((electron) => {
      electron.update(mouse);
      // Apply quantum tunneling effect occasionally
      electron.quantumTunnel(0.0001);
    });

    // Update orbital system
    this.orbitals.update();

    // Check for orbital configuration completion
    this.orbitals.checkPatternCompletion(this.electrons);

    // Update renderer
    this.renderer.update();
  }

  render() {
    const mouse = this.input.getMouse();

    // Clear canvas
    this.renderer.clear();

    // Draw quantum field background
    this.renderer.drawBackground(mouse);

    // Draw orbital targets
    this.orbitals.drawTargets(this.ctx);

    // Draw electrons
    this.electrons.forEach((electron) => {
      electron.draw(this.ctx);
    });

    // Draw orbital connections (if configuration complete)
    this.orbitals.drawConnections(this.ctx, this.electrons);

    // Draw UI (energy level, instructions, etc.)
    this.orbitals.drawUI(this.ctx);
  }

  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.gameLoop();
  }
}
