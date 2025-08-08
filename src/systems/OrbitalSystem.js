// Simple atomic orbital system with progressive levels
class OrbitalSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentLevel = 0;
    this.score = 0;

    // Define simple atomic configurations with colored orbitals - reduced to 3 levels
    this.levels = [
      // Start with 2 targets
      {
        name: "Dipole",
        orbitals: [
          { x: 350, y: 300, radius: 25, type: "blue" },
          { x: 450, y: 300, radius: 25, type: "orange" },
        ],
      },
      // 3 targets
      {
        name: "Triangle",
        orbitals: [
          { x: 400, y: 250, radius: 25, type: "blue" },
          { x: 350, y: 350, radius: 25, type: "orange" },
          { x: 450, y: 350, radius: 25, type: "blue" },
        ],
      },
      // 4 targets
      {
        name: "Square",
        orbitals: [
          { x: 350, y: 250, radius: 25, type: "blue" },
          { x: 450, y: 250, radius: 25, type: "orange" },
          { x: 350, y: 350, radius: 25, type: "orange" },
          { x: 450, y: 350, radius: 25, type: "blue" },
        ],
      },
    ];

    this.resetLevel();
  }

  resetLevel() {
    this.orbitals = this.levels[this.currentLevel].orbitals.map((o) => ({
      x: o.x,
      y: o.y,
      radius: o.radius,
      type: o.type,
      occupied: false,
    }));
  }

  checkCompletion() {
    return this.orbitals.every((o) => o.occupied);
  }

  nextLevel() {
    if (this.checkCompletion()) {
      this.score += (this.currentLevel + 1) * 100;
      this.currentLevel++;
      if (this.currentLevel >= this.levels.length) {
        this.currentLevel = 0; // Loop back
      }
      this.resetLevel();
      return true;
    }
    return false;
  }

  draw(ctx) {
    // Draw orbitals
    for (let orbital of this.orbitals) {
      ctx.save();

      // Orbital glow
      const gradient = ctx.createRadialGradient(
        orbital.x,
        orbital.y,
        0,
        orbital.x,
        orbital.y,
        orbital.radius
      );

      if (orbital.occupied) {
        if (orbital.type === "blue") {
          gradient.addColorStop(0, "rgba(100, 150, 255, 0.6)");
          gradient.addColorStop(1, "rgba(100, 150, 255, 0)");
        } else {
          gradient.addColorStop(0, "rgba(255, 150, 100, 0.6)");
          gradient.addColorStop(1, "rgba(255, 150, 100, 0)");
        }
      } else {
        if (orbital.type === "blue") {
          gradient.addColorStop(0, "rgba(100, 150, 255, 0.3)");
          gradient.addColorStop(1, "rgba(100, 150, 255, 0)");
        } else {
          gradient.addColorStop(0, "rgba(255, 150, 100, 0.3)");
          gradient.addColorStop(1, "rgba(255, 150, 100, 0)");
        }
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(
        orbital.x - orbital.radius,
        orbital.y - orbital.radius,
        orbital.radius * 2,
        orbital.radius * 2
      );

      // Orbital ring
      if (orbital.type === "blue") {
        ctx.strokeStyle = orbital.occupied
          ? "rgb(100, 150, 255)"
          : "rgb(80, 120, 200)";
      } else {
        ctx.strokeStyle = orbital.occupied
          ? "rgb(255, 150, 100)"
          : "rgb(200, 120, 80)";
      }
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(orbital.x, orbital.y, orbital.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // Simple UI
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${this.levels[this.currentLevel].name}`, 20, 30);
    ctx.fillText(`Score: ${this.score}`, 20, 50);
    ctx.fillText(
      `Electrons: ${this.orbitals.filter((o) => o.occupied).length}/${
        this.orbitals.length
      }`,
      20,
      70
    );

    if (this.checkCompletion()) {
      ctx.fillStyle = "yellow";
      ctx.font = "24px Arial";
      ctx.fillText("Complete! Click for next level", 200, 100);
    }
  }
}
