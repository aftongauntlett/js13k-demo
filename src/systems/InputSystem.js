// Input handling system
class InputSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    this.keyCallbacks = new Map();

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    // Keyboard event listener
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (this.keyCallbacks.has(key)) {
        e.preventDefault();
        this.keyCallbacks.get(key)();
      }
    });
  }

  // Register a callback for a specific key
  onKey(key, callback) {
    this.keyCallbacks.set(key.toLowerCase(), callback);
  }

  getMouse() {
    return this.mouse;
  }
}
