// Orbital configuration system for atomic physics simulation
class OrbitalSystem {
  constructor(canvas, colors) {
    this.canvas = canvas;
    this.colors = colors;
    this.currentPattern = 0;
    this.score = 0;
    this.completedCount = 0;
    this.orbitalRadius = 40; // Orbital shell capture radius
    this.occupiedOrbitals = []; // Track which orbitals have electrons

    // Define atomic orbital patterns (relative to canvas center)
    this.patterns = [
      {
        name: "Hydrogen (1s)",
        orbitals: [
          { x: 0, y: -120 }, // 1s orbital - top
          { x: -104, y: 60 }, // 1s orbital - bottom left
          { x: 104, y: 60 }, // 1s orbital - bottom right
        ],
        difficulty: 1,
        description: "Single electron shell configuration",
      },
      {
        name: "Helium (1s²)",
        orbitals: [
          { x: 0, y: -140 }, // 1s - top
          { x: -100, y: 0 }, // 1s - left
          { x: 100, y: 0 }, // 1s - right
          { x: 0, y: 140 }, // 1s - bottom
        ],
        difficulty: 2,
        description: "Filled 1s orbital",
      },
      {
        name: "Lithium (1s² 2s¹)",
        orbitals: [
          { x: 0, y: -160 }, // 1s - top
          { x: 0, y: 160 }, // 1s - bottom
          { x: -160, y: 0 }, // 2s - left
          { x: 160, y: 0 }, // 2s - right
          { x: 0, y: 0 }, // nucleus - center
        ],
        difficulty: 3,
        description: "Two electron shells",
      },
      {
        name: "Carbon (1s² 2s² 2p²)",
        orbitals: [
          { x: 0, y: -120 }, // 1s
          { x: 104, y: -60 }, // 1s
          { x: 104, y: 60 }, // 2s
          { x: 0, y: 120 }, // 2s
          { x: -104, y: 60 }, // 2p
          { x: -104, y: -60 }, // 2p
        ],
        difficulty: 4,
        description: "Complex orbital hybridization",
      },
      {
        name: "Neon (Full Shell)",
        orbitals: [
          { x: 0, y: -260 }, // 1s - outer ring
          { x: 80, y: -80 }, // 1s
          { x: 250, y: -80 }, // 2s - outer ring
          { x: 100, y: 60 }, // 2s
          { x: 155, y: 220 }, // 2p - outer ring
          { x: 0, y: 120 }, // 2p
          { x: -155, y: 220 }, // 2p - outer ring
          { x: -100, y: 60 }, // 2p
          { x: -250, y: -80 }, // 2p - outer ring
          { x: -80, y: -80 }, // 2p
        ],
        difficulty: 5,
        description: "Noble gas complete configuration",
      },
    ];

    this.isPatternComplete = false;
    this.completionTime = 0;
    this.showCompletionEffect = false;
    this.gameCompleted = false; // Track if all configurations are complete
  }

  getCurrentPattern() {
    return this.patterns[this.currentPattern];
  }

  getOrbitalPositions() {
    const pattern = this.getCurrentPattern();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    return pattern.orbitals.map((orbital) => ({
      x: centerX + orbital.x,
      y: centerY + orbital.y,
    }));
  }

  checkPatternCompletion(electrons) {
    // Skip pattern completion checking if all configs are complete
    if (this.gameCompleted) {
      return true;
    }

    const pattern = this.getCurrentPattern();
    const orbitals = this.getOrbitalPositions();
    let occupiedCount = 0;

    // Reset occupied orbitals tracking
    this.occupiedOrbitals = [];

    // Check each orbital for electron occupation
    orbitals.forEach((orbital, index) => {
      let hasElectron = false;
      electrons.forEach((electron) => {
        if (electron.isInTarget(orbital, this.orbitalRadius)) {
          hasElectron = true;
        }
      });

      if (hasElectron) {
        occupiedCount++;
        this.occupiedOrbitals.push(index);
      }
    });

    // Pattern is complete when all orbitals are filled
    const wasComplete = this.isPatternComplete;
    this.isPatternComplete = occupiedCount === pattern.orbitals.length;

    // If pattern just completed
    if (this.isPatternComplete && !wasComplete) {
      this.onPatternCompleted();
    }

    return this.isPatternComplete;
  }

  onPatternCompleted() {
    this.completedCount++;
    this.score += this.getCurrentPattern().difficulty * 100;
    this.showCompletionEffect = true;
    this.completionTime = 0;

    console.log(
      `Orbital configuration "${
        this.getCurrentPattern().name
      }" stabilized! Score: ${this.score}`
    );

    // Auto-advance to next pattern after delay
    setTimeout(() => {
      this.switchToNextPattern();
    }, 2000);
  }

  switchToNextPattern() {
    if (this.currentPattern < this.patterns.length - 1) {
      this.currentPattern++;
      this.isPatternComplete = false;
      this.showCompletionEffect = false;
      this.occupiedOrbitals = [];

      if (this.onPatternChange) {
        this.onPatternChange();
      }

      console.log(`New configuration: ${this.getCurrentPattern().name}`);
    } else {
      // All patterns completed
      this.gameCompleted = true;
      console.log(
        "All orbital configurations completed! Final score:",
        this.score
      );
    }
  }

  switchToPreviousPattern() {
    if (this.currentPattern > 0) {
      this.currentPattern--;
      this.isPatternComplete = false;
      this.showCompletionEffect = false;
      this.occupiedOrbitals = [];

      if (this.onPatternChange) {
        this.onPatternChange();
      }

      console.log(`Previous configuration: ${this.getCurrentPattern().name}`);
    }
  }

  resetGame() {
    this.currentPattern = 0;
    this.score = 0;
    this.completedCount = 0;
    this.isPatternComplete = false;
    this.showCompletionEffect = false;
    this.gameCompleted = false;
    this.occupiedOrbitals = [];

    console.log("Game reset to Hydrogen configuration");
  }

  // Scale orbital positions to fit canvas
  getScaledOrbitalPositions() {
    const pattern = this.getCurrentPattern();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Adaptive scaling based on canvas size and pattern complexity
    const baseScale = Math.min(this.canvas.width, this.canvas.height) / 600;
    const patternScale = pattern.name.includes("Neon") ? 0.7 : 0.9; // Scale down complex patterns
    const finalScale = baseScale * patternScale;

    return pattern.orbitals.map((orbital) => ({
      x: centerX + orbital.x * finalScale,
      y: centerY + orbital.y * finalScale,
    }));
  }

  drawTargets(ctx) {
    const orbitals = this.getScaledOrbitalPositions();

    ctx.save();

    orbitals.forEach((orbital, index) => {
      const isOccupied = this.occupiedOrbitals.includes(index);

      // Orbital shell visualization
      ctx.globalAlpha = isOccupied ? 0.6 : 0.3;
      ctx.strokeStyle = isOccupied
        ? `rgb(${this.colors.warm})` // Occupied orbital - high energy
        : `rgb(${this.colors.accent})`; // Available orbital
      ctx.lineWidth = 2;

      // Draw orbital shell
      ctx.beginPath();
      ctx.arc(orbital.x, orbital.y, this.orbitalRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw inner orbital core
      if (isOccupied) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = `rgb(${this.colors.warm})`;
        ctx.beginPath();
        ctx.arc(orbital.x, orbital.y, this.orbitalRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Orbital energy level indicator
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = `rgb(${this.colors.glow})`;
      ctx.beginPath();
      ctx.arc(orbital.x, orbital.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawConnections(ctx, electrons) {
    if (!this.isPatternComplete) return;

    const orbitals = this.getScaledOrbitalPositions();
    ctx.save();

    // Draw quantum entanglement lines between filled orbitals
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = `rgb(${this.colors.quantum})`;
    ctx.lineWidth = 1;

    // Connect all occupied orbitals
    for (let i = 0; i < this.occupiedOrbitals.length; i++) {
      for (let j = i + 1; j < this.occupiedOrbitals.length; j++) {
        const orbital1 = orbitals[this.occupiedOrbitals[i]];
        const orbital2 = orbitals[this.occupiedOrbitals[j]];

        ctx.beginPath();
        ctx.moveTo(orbital1.x, orbital1.y);
        ctx.lineTo(orbital2.x, orbital2.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawUI(ctx) {
    const pattern = this.getCurrentPattern();

    ctx.save();
    ctx.fillStyle = `rgb(${this.colors.glow})`;
    ctx.font = "16px Courier New, monospace";
    ctx.textAlign = "center";

    // Configuration name and description
    ctx.fillText(`Configuration: ${pattern.name}`, this.canvas.width / 2, 40);

    ctx.font = "12px Courier New, monospace";
    ctx.fillText(pattern.description, this.canvas.width / 2, 60);

    // Score and progress
    ctx.fillText(`Energy Level: ${this.score}`, this.canvas.width / 2, 80);
    ctx.fillText(
      `${this.completedCount}/${this.patterns.length} Completed | Orbitals: ${this.occupiedOrbitals.length}/${pattern.orbitals.length}`,
      this.canvas.width / 2,
      100
    );

    // Instructions
    ctx.font = "11px Courier New, monospace";
    ctx.fillStyle = `rgb(${this.colors.accent})`;
    ctx.fillText(
      "Guide electrons to orbital shells",
      this.canvas.width / 2,
      this.canvas.height - 60
    );
    ctx.fillText(
      "Use electromagnetic fields to achieve stable configurations",
      this.canvas.width / 2,
      this.canvas.height - 40
    );

    // Test controls (bottom left)
    ctx.textAlign = "left";
    ctx.fillStyle = `rgb(${this.colors.sage})`;
    ctx.fillText("Test Controls:", 20, this.canvas.height - 80);
    ctx.fillText("N = Next Pattern", 20, this.canvas.height - 65);
    ctx.fillText("P = Previous Pattern", 20, this.canvas.height - 50);
    ctx.fillText("C = Complete Current", 20, this.canvas.height - 35);
    ctx.fillText("R = Reset Game", 20, this.canvas.height - 20);

    // Show completion effect
    if (this.showCompletionEffect) {
      this.completionTime++;

      const alpha = Math.sin(this.completionTime * 0.2) * 0.5 + 0.5;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${this.colors.warm})`;
      ctx.font = "20px Courier New, monospace";
      ctx.fillText(
        "Configuration Stabilized!",
        this.canvas.width / 2,
        this.canvas.height / 2 - 50
      );

      if (this.completionTime > 120) {
        this.showCompletionEffect = false;
      }
    }

    // Game completion
    if (this.gameCompleted) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = `rgb(${this.colors.quantum})`;
      ctx.font = "24px Courier New, monospace";
      ctx.fillText(
        "All Configurations Complete!",
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      ctx.font = "16px Courier New, monospace";
      ctx.fillText(
        `Final Energy Level: ${this.score}`,
        this.canvas.width / 2,
        this.canvas.height / 2 + 30
      );
    }

    ctx.restore();
  }

  update() {
    // Update any animation timers
    if (this.showCompletionEffect) {
      this.completionTime++;
    }
  }
}
