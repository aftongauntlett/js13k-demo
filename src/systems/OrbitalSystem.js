// Simple atomic orbital system with progressive levels
class OrbitalSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentLevel = 0;
    this.score = 0;
    this.time = 0;
    this.levelTime = 30; // 30 seconds per level

    this.levels = [
      {
        name: "Dipole",
        orbitals: [
          {
            x: 350,
            y: 300,
            radius: 25,
            type: "blue",
            rotate: true,
            speed: 0.02,
            gap: Math.PI / 3,
          },
          { x: 450, y: 300, radius: 25, type: "orange" },
        ],
      },
      {
        name: "Triangle",
        orbitals: [
          {
            x: 400,
            y: 250,
            radius: 25,
            type: "blue",
            rotate: true,
            speed: 0.03,
            gap: Math.PI / 4,
          },
          { x: 350, y: 350, radius: 25, type: "orange" },
          { x: 450, y: 350, radius: 25, type: "blue" },
        ],
      },
      {
        name: "Square",
        orbitals: [
          {
            x: 350,
            y: 250,
            radius: 25,
            type: "blue",
            rotate: true,
            speed: 0.04,
            gap: Math.PI / 6,
          },
          { x: 450, y: 250, radius: 25, type: "orange" },
          { x: 350, y: 350, radius: 25, type: "orange" },
          {
            x: 450,
            y: 350,
            radius: 25,
            type: "blue",
            rotate: true,
            speed: 0.035,
            gap: Math.PI / 5,
          },
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
      rotate: o.rotate || false,
      speed: o.speed || 0,
      gap: o.gap || 0,
      angle: 0,
    }));
    this.time = 0;
  }

  checkCompletion() {
    return this.orbitals.every((o) => o.occupied);
  }

  update() {
    this.time += 1 / 60; // Assuming 60fps

    // Update rotating orbitals
    for (let orbital of this.orbitals) {
      if (orbital.rotate) {
        orbital.angle += orbital.speed;
      }
    }
  }

  // Check if electron can enter rotating orbital
  canEnterOrbital(orbital, electronX, electronY) {
    if (!orbital.rotate) return true;

    let dx = electronX - orbital.x,
      dy = electronY - orbital.y;
    let electronAngle = Math.atan2(dy, dx);
    let relativeAngle =
      (electronAngle - orbital.angle + Math.PI * 2) % (Math.PI * 2);

    return (
      relativeAngle < orbital.gap || relativeAngle > Math.PI * 2 - orbital.gap
    );
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

      if (orbital.rotate && !orbital.occupied) {
        // Rotating orbital with gap
        ctx.translate(orbital.x, orbital.y);
        ctx.rotate(orbital.angle);

        ctx.strokeStyle =
          orbital.type === "blue" ? "rgb(80,120,200)" : "rgb(200,120,80)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          orbital.radius,
          orbital.gap / 2,
          Math.PI * 2 - orbital.gap / 2
        );
        ctx.stroke();

        // Gap indicators
        ctx.strokeStyle =
          orbital.type === "blue"
            ? "rgba(100,150,255,0.6)"
            : "rgba(255,100,100,0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        let r1 = orbital.radius,
          r2 = r1 + 8,
          g = orbital.gap / 2;
        ctx.moveTo(r1 * Math.cos(g), r1 * Math.sin(g));
        ctx.lineTo(r2 * Math.cos(g), r2 * Math.sin(g));
        ctx.moveTo(r1 * Math.cos(-g), r1 * Math.sin(-g));
        ctx.lineTo(r2 * Math.cos(-g), r2 * Math.sin(-g));
        ctx.stroke();

        ctx.restore();
      } else {
        // Static/occupied orbital
        let grad = ctx.createRadialGradient(
          orbital.x,
          orbital.y,
          0,
          orbital.x,
          orbital.y,
          orbital.radius
        );
        let blue = orbital.type === "blue";
        let occ = orbital.occupied;

        if (occ) {
          grad.addColorStop(
            0,
            blue ? "rgba(100,150,255,0.6)" : "rgba(255,150,100,0.6)"
          );
          grad.addColorStop(
            1,
            blue ? "rgba(100,150,255,0)" : "rgba(255,150,100,0)"
          );
        } else {
          grad.addColorStop(
            0,
            blue ? "rgba(100,150,255,0.3)" : "rgba(255,150,100,0.3)"
          );
          grad.addColorStop(
            1,
            blue ? "rgba(100,150,255,0)" : "rgba(255,150,100,0)"
          );
        }

        ctx.fillStyle = grad;
        ctx.fillRect(
          orbital.x - orbital.radius,
          orbital.y - orbital.radius,
          orbital.radius * 2,
          orbital.radius * 2
        );

        ctx.strokeStyle = blue
          ? occ
            ? "rgb(100,150,255)"
            : "rgb(80,120,200)"
          : occ
          ? "rgb(255,150,100)"
          : "rgb(200,120,80)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(orbital.x, orbital.y, orbital.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // UI
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

    let timeLeft = Math.max(0, this.levelTime - this.time);
    ctx.fillStyle = timeLeft < 10 ? "rgb(255,100,100)" : "white";
    ctx.fillText(`Time: ${timeLeft.toFixed(1)}s`, 20, 90);

    if (this.checkCompletion()) {
      ctx.fillStyle = "yellow";
      ctx.font = "24px Arial";
      ctx.fillText("Complete! Click for next level", 200, 100);
    } else if (timeLeft <= 0) {
      ctx.fillStyle = "red";
      ctx.font = "20px Arial";
      ctx.fillText("Time's up! Click to retry", 200, 100);
    }
  }
}
