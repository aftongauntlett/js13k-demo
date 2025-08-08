// Main game class
class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Color palette
    this.colors = {
      bg1: "10, 22, 40", // Deep teal-blue
      bg2: "26, 35, 50", // Slightly lighter
      bg3: "42, 51, 66", // Mid tone
      accent: "74, 144, 255", // Bright blue glow
      warm: "255, 140, 66", // Burnt orange
      sage: "135, 169, 107", // Muted sage
      purple: "107, 70, 193", // Deep purple
      glow: "100, 255, 218", // Cyan glow
    };

    // Initialize systems
    this.renderer = new Renderer(this.canvas, this.ctx, this.colors);
    this.input = new InputSystem(this.canvas);
    this.constellations = new ConstellationSystem(this.canvas, this.colors);

    // Set up pattern change callback
    this.constellations.onPatternChange = () => {
      this.initializeFireflies();
    };

    // Initialize fireflies - adjust count based on current pattern
    this.fireflies = [];
    this.initializeFireflies();

    // Set up test controls
    this.setupTestControls();

    console.log(
      "Mystic Grove initialized! Guide the fireflies to form constellations."
    );
  }

  setupTestControls() {
    // N = Next pattern
    this.input.onKey("n", () => {
      this.constellations.switchToNextPattern();
    });

    // P = Previous pattern
    this.input.onKey("p", () => {
      this.constellations.switchToPreviousPattern();
    });

    // C = Complete current pattern (for testing)
    this.input.onKey("c", () => {
      this.constellations.onPatternCompleted();
    });

    // R = Reset game
    this.input.onKey("r", () => {
      this.constellations.resetGame();
      this.initializeFireflies(); // Still need this since resetGame doesn't trigger callback
    });
  }

  initializeFireflies() {
    // Clear existing fireflies
    this.fireflies = [];

    // Create enough fireflies for the current pattern (plus some extras)
    const pattern = this.constellations.getCurrentPattern();
    // Give extra fireflies for the Star pattern since it has 10 targets
    const baseExtra = pattern.name === "Star" ? 5 : 3;
    const fireflyCount = Math.max(pattern.targets.length + baseExtra, 8);

    for (let i = 0; i < fireflyCount; i++) {
      this.fireflies.push(new Firefly(this.canvas, this.colors));
    }

    console.log(
      `${pattern.name}: Created ${fireflyCount} fireflies for ${pattern.targets.length} targets`
    );
  }

  update() {
    const mouse = this.input.getMouse();

    // Update fireflies
    this.fireflies.forEach((firefly) => {
      firefly.update(mouse);
    });

    // Update constellation system
    this.constellations.update();

    // Check for pattern completion
    this.constellations.checkPatternCompletion(this.fireflies);

    // Update renderer
    this.renderer.update();
  }

  render() {
    const mouse = this.input.getMouse();

    // Clear canvas
    this.renderer.clear();

    // Draw atmospheric background
    this.renderer.drawBackground(mouse);

    // Draw center glow effect
    this.renderer.drawCenterGlow();

    // Draw constellation targets
    this.constellations.drawTargets(this.ctx);

    // Draw fireflies
    this.fireflies.forEach((firefly) => {
      firefly.draw(this.ctx);
    });

    // Draw constellation connections (if pattern complete)
    this.constellations.drawConnections(this.ctx, this.fireflies);

    // Draw UI (score, instructions, etc.)
    this.constellations.drawUI(this.ctx);
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
