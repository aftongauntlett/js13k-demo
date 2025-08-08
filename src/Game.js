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
    
    // Initialize fireflies
    this.fireflies = [];
    for (let i = 0; i < 15; i++) {
      this.fireflies.push(new Firefly(this.canvas, this.colors));
    }

    console.log("Mystic Grove initialized! Move your mouse around the canvas.");
  }

  update() {
    const mouse = this.input.getMouse();
    
    // Update fireflies
    this.fireflies.forEach((firefly) => {
      firefly.update(mouse);
    });

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

    // Draw fireflies
    this.fireflies.forEach((firefly) => {
      firefly.draw(this.ctx);
    });
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
