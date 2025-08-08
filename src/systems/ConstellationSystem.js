// Constellation formation game system
class ConstellationSystem {
  constructor(canvas, colors) {
    this.canvas = canvas;
    this.colors = colors;
    this.currentPattern = 0;
    this.score = 0;
    this.completedCount = 0;
    this.targetRadius = 40; // Increased from 25 to make it easier to hit
    this.occupiedTargets = []; // Track which targets have fireflies

    // Define constellation patterns (relative to canvas center)
    this.patterns = [
      {
        name: "Triangle",
        targets: [
          { x: 0, y: -120 }, // Top
          { x: -104, y: 60 }, // Bottom left
          { x: 104, y: 60 }, // Bottom right
        ],
        difficulty: 1,
      },
      {
        name: "Diamond",
        targets: [
          { x: 0, y: -140 }, // Top
          { x: -100, y: 0 }, // Left
          { x: 100, y: 0 }, // Right
          { x: 0, y: 140 }, // Bottom
        ],
        difficulty: 2,
      },
      {
        name: "Cross",
        targets: [
          { x: 0, y: -160 }, // Top
          { x: 0, y: 160 }, // Bottom
          { x: -160, y: 0 }, // Left
          { x: 160, y: 0 }, // Right
          { x: 0, y: 0 }, // Center
        ],
        difficulty: 3,
      },
      {
        name: "Hexagon",
        targets: [
          { x: 0, y: -120 },
          { x: 104, y: -60 },
          { x: 104, y: 60 },
          { x: 0, y: 120 },
          { x: -104, y: 60 },
          { x: -104, y: -60 },
        ],
        difficulty: 4,
      },
      {
        name: "Star",
        targets: [
          { x: 0, y: -260 }, // Top point - near canvas edge
          { x: 80, y: -80 }, // Upper right inner
          { x: 250, y: -80 }, // Right point - near canvas edge
          { x: 100, y: 60 }, // Lower right inner
          { x: 155, y: 220 }, // Lower right point - near canvas edge
          { x: 0, y: 120 }, // Lower inner
          { x: -155, y: 220 }, // Lower left point - near canvas edge
          { x: -100, y: 60 }, // Lower left inner
          { x: -250, y: -80 }, // Left point - near canvas edge
          { x: -80, y: -80 }, // Upper left inner
        ],
        difficulty: 5,
      },
    ];

    this.isPatternComplete = false;
    this.completionTime = 0;
    this.showCompletionEffect = false;
    this.gameCompleted = false; // Track if all constellations are finished
  }

  getCurrentPattern() {
    return this.patterns[this.currentPattern];
  }

  getTargetPositions() {
    const pattern = this.getCurrentPattern();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    return pattern.targets.map((target) => ({
      x: centerX + target.x,
      y: centerY + target.y,
    }));
  }

  checkPatternCompletion(fireflies) {
    // Skip pattern completion checking if game is finished
    if (this.gameCompleted) {
      return true;
    }

    const targets = this.getTargetPositions();
    const pattern = this.getCurrentPattern();

    // Reset occupied targets
    this.occupiedTargets = new Array(targets.length).fill(false);

    // Need at least as many fireflies as targets
    if (fireflies.length < targets.length) {
      console.log(
        `Not enough fireflies: ${fireflies.length} fireflies, ${targets.length} targets needed`
      );
      return false;
    }

    // Use the same progressive sizing as visual rendering for hit detection
    // Less aggressive scaling - don't make Star pattern too tiny
    const sizeMultiplier = 1.1 - (pattern.difficulty - 1) * 0.1; // 1.1 → 0.7 (instead of 1.2 → 0.6)
    const effectiveRadius = this.targetRadius * sizeMultiplier;

    let matchedTargets = 0;
    const usedFireflies = new Set();

    // For each target, find the closest available firefly
    targets.forEach((target, targetIndex) => {
      let closestFirefly = null;
      let closestDistance = Infinity;

      fireflies.forEach((firefly, fireflyIndex) => {
        if (usedFireflies.has(fireflyIndex)) return;

        const dx = firefly.x - target.x;
        const dy = firefly.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < effectiveRadius && distance < closestDistance) {
          closestDistance = distance;
          closestFirefly = fireflyIndex;
        }
      });

      if (closestFirefly !== null) {
        usedFireflies.add(closestFirefly);
        this.occupiedTargets[targetIndex] = true;
        matchedTargets++;
      }
    });

    const wasComplete = this.isPatternComplete;
    this.isPatternComplete = matchedTargets === targets.length;

    // Handle completion
    if (this.isPatternComplete && !wasComplete) {
      this.onPatternCompleted();
    }

    return this.isPatternComplete;
  }

  onPatternCompleted() {
    this.completedCount++;
    this.score += this.getCurrentPattern().difficulty * 100;
    this.showCompletionEffect = true;
    this.completionTime = Date.now();

    console.log(
      `Constellation "${this.getCurrentPattern().name}" completed! Score: ${
        this.score
      }`
    );

    // Auto-advance to next pattern after delay
    setTimeout(() => {
      this.nextPattern();
    }, 2000);
  }

  nextPattern() {
    if (this.currentPattern < this.patterns.length - 1) {
      this.currentPattern++;
      this.isPatternComplete = false;
      this.showCompletionEffect = false;
      console.log(`New constellation: ${this.getCurrentPattern().name}`);

      // Notify game of pattern change
      if (this.onPatternChange) {
        this.onPatternChange();
      }
    } else {
      console.log("All constellations completed! Final score:", this.score);
      this.gameCompleted = true; // Mark game as completed
    }
  }

  // Manual pattern switching for testing
  switchToNextPattern() {
    if (this.currentPattern < this.patterns.length - 1) {
      this.currentPattern++;
    } else {
      this.currentPattern = 0; // Loop back to first pattern
    }
    this.isPatternComplete = false;
    this.showCompletionEffect = false;
    console.log(`Switched to constellation: ${this.getCurrentPattern().name}`);

    // Notify game of pattern change
    if (this.onPatternChange) {
      this.onPatternChange();
    }
  }

  switchToPreviousPattern() {
    if (this.currentPattern > 0) {
      this.currentPattern--;
    } else {
      this.currentPattern = this.patterns.length - 1; // Loop to last pattern
    }
    this.isPatternComplete = false;
    this.showCompletionEffect = false;
    console.log(`Switched to constellation: ${this.getCurrentPattern().name}`);

    // Notify game of pattern change
    if (this.onPatternChange) {
      this.onPatternChange();
    }
  }

  resetGame() {
    this.currentPattern = 0;
    this.score = 0;
    this.completedCount = 0;
    this.isPatternComplete = false;
    this.showCompletionEffect = false;
    this.gameCompleted = false; // Reset game completion state
    console.log("Game reset to Triangle constellation");
  }

  drawTargets(ctx) {
    const targets = this.getTargetPositions();
    const pattern = this.getCurrentPattern();
    const time = Date.now() * 0.001;

    // Progressive target size reduction - harder levels have smaller targets
    // Less aggressive scaling to keep Star pattern playable
    const sizeMultiplier = 1.1 - (pattern.difficulty - 1) * 0.1; // 1.1 → 0.7
    const effectiveRadius = this.targetRadius * sizeMultiplier;

    targets.forEach((target, index) => {
      const isOccupied = this.occupiedTargets[index];
      const pulse = Math.sin(time * 2 + index * 0.5) * 0.3 + 0.7;
      const alpha = this.isPatternComplete ? 0.3 : 0.6;

      // Choose colors based on occupation status
      const outerColor = isOccupied ? this.colors.warm : this.colors.accent;
      const innerColor = isOccupied ? this.colors.warm : this.colors.glow;
      const glowIntensity = isOccupied ? 1.5 : 1.0;

      // Outer glow - bigger and more prominent when occupied, scaled by difficulty
      ctx.save();
      ctx.globalAlpha = alpha * pulse * 0.4 * glowIntensity;
      ctx.fillStyle = `rgb(${outerColor})`;
      ctx.beginPath();
      const outerRadius = isOccupied
        ? effectiveRadius * 1.8
        : effectiveRadius * 1.5;
      ctx.arc(target.x, target.y, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Middle glow for occupied targets
      if (isOccupied) {
        ctx.globalAlpha = alpha * pulse * 0.6;
        ctx.fillStyle = `rgb(${this.colors.warm})`;
        ctx.beginPath();
        ctx.arc(target.x, target.y, effectiveRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner circle - scaled by difficulty
      ctx.globalAlpha = alpha * pulse * 0.8;
      ctx.strokeStyle = `rgb(${innerColor})`;
      ctx.lineWidth = isOccupied ? 3 : 2;
      ctx.beginPath();
      ctx.arc(target.x, target.y, effectiveRadius * 0.8, 0, Math.PI * 2);
      ctx.stroke();

      // Center dot
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${innerColor})`;
      ctx.beginPath();
      const centerSize = isOccupied ? 5 : 3;
      ctx.arc(target.x, target.y, centerSize, 0, Math.PI * 2);
      ctx.fill();

      // Add a subtle pulsing ring for occupied targets
      if (isOccupied) {
        ctx.globalAlpha = alpha * pulse * 0.4;
        ctx.strokeStyle = `rgb(${this.colors.warm})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(
          target.x,
          target.y,
          effectiveRadius * (0.6 + pulse * 0.2),
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  drawConnections(ctx, fireflies) {
    if (!this.isPatternComplete) return;

    const targets = this.getTargetPositions();
    const time = Date.now() * 0.001;

    // Draw constellation lines
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = `rgb(${this.colors.glow})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = `rgb(${this.colors.glow})`;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    targets.forEach((target, index) => {
      if (index === 0) {
        ctx.moveTo(target.x, target.y);
      } else {
        ctx.lineTo(target.x, target.y);
      }
    });

    // Close the shape for most patterns
    if (
      this.getCurrentPattern().name !== "Cross" &&
      this.getCurrentPattern().name !== "Star"
    ) {
      ctx.closePath();
    }

    ctx.stroke();
    ctx.restore();
  }

  drawUI(ctx) {
    const pattern = this.getCurrentPattern();

    // Pattern name and progress
    ctx.save();
    ctx.fillStyle = `rgb(${this.colors.glow})`;
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Constellation: ${pattern.name}`, this.canvas.width / 2, 40);

    // Score
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, 65);

    // Progress
    const occupiedCount = this.occupiedTargets.filter(Boolean).length;
    const totalTargets = this.getCurrentPattern().targets.length;
    ctx.fillText(
      `${this.completedCount}/${this.patterns.length} Completed | Targets: ${occupiedCount}/${totalTargets}`,
      this.canvas.width / 2,
      85
    );

    // Test controls (for development)
    ctx.font = "12px monospace";
    ctx.fillStyle = `rgba(${this.colors.glow}, 0.8)`;
    ctx.textAlign = "left";
    ctx.fillText("Test Controls:", 20, this.canvas.height - 75);
    ctx.fillText("N = Next Pattern", 20, this.canvas.height - 60);
    ctx.fillText("P = Previous Pattern", 20, this.canvas.height - 45);
    ctx.fillText("C = Complete Current", 20, this.canvas.height - 30);
    ctx.fillText("R = Reset Game", 20, this.canvas.height - 15);

    // Instructions
    if (this.completedCount === 0) {
      ctx.font = "14px monospace";
      ctx.fillStyle = `rgba(${this.colors.glow}, 0.7)`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Guide fireflies to the glowing targets",
        this.canvas.width / 2,
        this.canvas.height - 40
      );
      ctx.fillText(
        "Use your mouse to attract and repel them",
        this.canvas.width / 2,
        this.canvas.height - 20
      );
    }

    // Completion effect
    if (this.showCompletionEffect) {
      const elapsed = Date.now() - this.completionTime;
      const alpha = Math.max(0, 1 - elapsed / 2000);

      if (alpha > 0) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${this.colors.warm})`;
        ctx.font = "24px monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          "Constellation Complete!",
          this.canvas.width / 2,
          this.canvas.height / 2 - 50
        );
        ctx.font = "18px monospace";
        ctx.fillText(
          `+${pattern.difficulty * 100} points`,
          this.canvas.width / 2,
          this.canvas.height / 2 - 20
        );
        ctx.restore();
      } else {
        this.showCompletionEffect = false;
      }
    }

    ctx.restore();
  }

  update() {
    // Update any time-based effects
  }
}
