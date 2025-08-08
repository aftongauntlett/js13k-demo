// Input handling system
class InputSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }
}
