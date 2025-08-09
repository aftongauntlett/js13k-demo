// Simple atomic orbital system with progressive levels
class OrbitalSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentLevel = 0;
    this.score = 0;
    this.TAU = Math.PI * 2; // 2π constant for efficiency
    this.time = 0;
    this.levelTime = 45; // 45 seconds per level

    // Orbital factory for consistent properties and smaller code
    const G3 = Math.PI / 3,
      G4 = Math.PI / 4,
      G6 = Math.PI / 6;
    const o = (x, y, type, speed = 0.025, gap = G4) => ({
      x,
      y,
      type,
      speed,
      gap,
      radius: 25,
      rotate: true,
    });

    this.levels = [
      {
        name: "Dipole",
        orbitals: [
          o(350, 300, "blue", 0.02, G3),
          o(450, 300, "orange", 0.018, G3),
          o(300, 250, "blue", 0.025, G3),
          o(500, 350, "orange", 0.022, G3),
        ],
      },
      {
        name: "Triangle",
        orbitals: [
          o(400, 250, "blue", 0.03),
          o(350, 350, "orange", 0.026),
          o(450, 350, "blue", 0.025),
          o(300, 300, "orange", 0.024),
          o(500, 300, "blue", 0.02),
        ],
      },
      {
        name: "Square",
        orbitals: [
          o(350, 250, "blue", 0.04, G6),
          o(450, 250, "orange", 0.032, G6),
          o(350, 350, "orange", 0.028, G6),
          o(450, 350, "blue", 0.035, G6),
          o(300, 300, "blue", 0.03, G6),
          o(500, 300, "orange", 0.025, G6),
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
      rotate: o.rotate,
      speed: o.speed,
      gap: o.gap,
      angle: 0,
      stunned: false,
      stunnedTime: 0,
      hitCount: 0,
      shaking: false,
      shakeTime: 0,
      shakeOffsetX: 0,
      shakeOffsetY: 0,
    }));
    this.time = 0;
  }

  checkCompletion() {
    return this.orbitals.every((o) => o.occupied);
  }

  update() {
    const M = Math; // Shorter reference
    this.time += 1 / 60; // Assuming 60fps

    // Update rotating orbitals
    for (let orbital of this.orbitals) {
      if (orbital.rotate) {
        orbital.angle += orbital.speed;
      }

      // Update stunned orbitals
      if (orbital.stunned) {
        orbital.stunnedTime -= 1 / 60;
        if (orbital.stunnedTime <= 0) {
          orbital.stunned = false;
        }
      }

      // Update shaking orbitals
      if (orbital.shaking) {
        orbital.shakeTime -= 1 / 60;
        if (orbital.shakeTime <= 0) {
          orbital.shaking = false;
          orbital.shakeOffsetX = 0;
          orbital.shakeOffsetY = 0;
        } else {
          // Generate random shake offset
          let intensity = orbital.shakeTime * 8; // Fade out over time
          orbital.shakeOffsetX = (M.random() - 0.5) * intensity;
          orbital.shakeOffsetY = (M.random() - 0.5) * intensity;
        }
      }
    }
  }

  // Check if electron can enter orbital gap
  canEnterOrbital(orbital, electronX, electronY) {
    if (orbital.stunned) return false; // Stunned orbitals can't accept electrons

    let dx = electronX - orbital.x,
      dy = electronY - orbital.y;
    let electronAngle = Math.atan2(dy, dx);
    let relativeAngle = (electronAngle - orbital.angle + this.TAU) % this.TAU;

    return (
      relativeAngle < orbital.gap || relativeAngle > this.TAU - orbital.gap
    );
  }

  // Stun an orbital when wrong-color electron hits it
  stunOrbital(orbital) {
    orbital.stunned = true;
    orbital.stunnedTime = 3; // 3 seconds stun duration
  }

  // Handle hits on occupied orbitals
  hitOccupiedOrbital(orbital) {
    orbital.hitCount++;
    orbital.shaking = true;
    orbital.shakeTime = 0.5; // Shake for 0.5 seconds

    if (orbital.hitCount >= 2) {
      // Knock out the electron
      orbital.occupied = false;
      orbital.hitCount = 0;
      orbital.shaking = false;
      orbital.shakeOffsetX = 0;
      orbital.shakeOffsetY = 0;
      return true; // Electron was knocked out
    }
    return false; // Electron still in orbital
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
    // Color helpers for smaller code
    const colors = {
      blue: ["rgba(100,150,255,", "rgb(100,150,255)", "rgb(80,120,200)"],
      orange: ["rgba(255,150,100,", "rgb(255,150,100)", "rgb(200,120,80)"],
      grey: "rgb(128,128,128)",
    };

    // Draw orbitals
    for (let orbital of this.orbitals) {
      ctx.save();

      let blue = orbital.type === "blue";
      let occ = orbital.occupied;
      let stunned = orbital.stunned;
      let c = colors[orbital.type] || colors.grey;

      if (occ) {
        // Occupied orbital - show as filled circle with glow
        ctx.shadowColor = c[0] + "0.8)";
        ctx.shadowBlur = 20;

        // Apply shake offset for occupied orbitals
        let drawX = orbital.x + orbital.shakeOffsetX;
        let drawY = orbital.y + orbital.shakeOffsetY;

        let grad = ctx.createRadialGradient(
          drawX,
          drawY,
          0,
          drawX,
          drawY,
          orbital.radius
        );
        grad.addColorStop(0, c[0] + "0.9)");
        grad.addColorStop(1, c[0] + "0.2)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, orbital.radius, 0, this.TAU);
        ctx.fill();

        ctx.strokeStyle = c[1];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(drawX, drawY, orbital.radius, 0, this.TAU);
        ctx.stroke();
      } else {
        // Unoccupied rotating orbital with gap
        ctx.translate(orbital.x, orbital.y);
        ctx.rotate(orbital.angle);

        // Main arc with gap
        ctx.strokeStyle = stunned ? colors.grey : c[2];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          orbital.radius,
          orbital.gap / 2,
          this.TAU - orbital.gap / 2
        );
        ctx.stroke();

        // Gap indicators
        ctx.strokeStyle = stunned ? "rgba(128,128,128,0.6)" : c[0] + "0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        let r1 = orbital.radius,
          r2 = r1 + 8,
          g = orbital.gap / 2;
        const M = Math; // Shorter reference for size optimization
        ctx.moveTo(r1 * M.cos(g), r1 * M.sin(g));
        ctx.lineTo(r2 * M.cos(g), r2 * M.sin(g));
        ctx.moveTo(r1 * M.cos(-g), r1 * M.sin(-g));
        ctx.lineTo(r2 * M.cos(-g), r2 * M.sin(-g));
        ctx.stroke();
      }

      ctx.restore();
    }

    // UI Constants
    const F16 = "16px Arial",
      F18 = "18px 'Courier New', monospace";
    const WHITE = "white",
      CYAN = "rgb(0, 255, 255)";

    // UI
    ctx.fillStyle = WHITE;
    ctx.font = F16;
    ctx.fillText(`${this.levels[this.currentLevel].name}`, 20, 30);

    // Enhanced score text with glow effect
    ctx.save();
    ctx.font = F18;
    ctx.textAlign = "left";

    // Glow effect for score
    ctx.shadowColor = CYAN;
    ctx.shadowBlur = 8;
    ctx.fillStyle = CYAN;
    ctx.fillText(`SCORE: ${this.score}`, 20, 55);

    ctx.restore();

    ctx.fillStyle = WHITE;
    ctx.font = F16;
    ctx.fillText(
      `Electrons: ${this.orbitals.filter((o) => o.occupied).length}/${
        this.orbitals.length
      }`,
      20,
      80
    );

    // Timer display
    let timeLeft = Math.max(0, this.levelTime - this.time);
    ctx.fillStyle = timeLeft < 10 ? "rgb(255,100,100)" : "white";
    ctx.fillText(`Time: ${timeLeft.toFixed(1)}s`, 20, 100);

    if (this.checkCompletion()) {
      ctx.save();

      // Center the completion text
      ctx.textAlign = "center";
      ctx.font = "32px 'Courier New', monospace";

      // Multiple glow layers for enhanced effect
      ctx.shadowColor = "rgb(255, 255, 0)";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "rgb(255, 255, 0)";
      ctx.fillText("LEVEL COMPLETE", this.canvas.width / 2, 150);

      // Secondary glow
      ctx.shadowColor = "rgb(255, 200, 0)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "rgb(255, 255, 200)";
      ctx.fillText("LEVEL COMPLETE", this.canvas.width / 2, 150);

      // Smaller instruction text
      ctx.font = "18px 'Courier New', monospace";
      ctx.shadowColor = "rgb(0, 255, 255)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "rgb(0, 255, 255)";
      ctx.fillText(">> CLICK FOR NEXT LEVEL <<", this.canvas.width / 2, 180);

      ctx.restore();
    } else if (timeLeft <= 0) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "24px 'Courier New', monospace";
      ctx.shadowColor = "rgb(255, 100, 100)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgb(255, 100, 100)";
      ctx.fillText("TIME'S UP! CLICK TO RETRY", this.canvas.width / 2, 150);
      ctx.restore();
    }
  }
}
