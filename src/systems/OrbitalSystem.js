// Simple atomic orbital system with progressive levels
class OrbitalSystem {
  constructor(canvas, audioSystem = null) {
    this.canvas = canvas;
    this.currentLevel = 0;
    this.score = 0;
    this.TAU = Math.PI * 2; // 2π constant for efficiency
    this.time = 0;
    this.levelTime = 45; // 45 seconds per level
    this.audio = audioSystem; // Reference to audio system
    this.timeWarningPlayed = false; // Track if time warning sound has been played

    // Orbital factory for consistent properties and smaller code
    const G3 = Math.PI / 3,
      G4 = Math.PI / 4,
      G5 = Math.PI / 5,
      G6 = Math.PI / 6,
      Gsharp4 = Math.PI / 3.5, // G# orbital gap size
      A4 = Math.PI / 4.5; // A orbital gap size

    // Center coordinates for atomic structure
    const CX = this.canvas.width / 2;
    const CY = this.canvas.height / 2;

    // Shell factory: (shell, position_angle, type, gap_size, rotation_speed)
    const shell = (radius, angle, type, gap = G4, speed = 0.02) => ({
      x: CX + Math.cos(angle) * radius,
      y: CY + Math.sin(angle) * radius,
      type,
      speed,
      gap,
      radius: 20,
      rotate: true,
      shell: radius, // Track which shell this belongs to
    });

    // Proper Bohr model shell radii and configurations
    // K shell (n=1): max 2 electrons, radius ~80px
    // L shell (n=2): max 8 electrons, radius ~140px
    // M shell (n=3): max 18 electrons, radius ~200px
    const K_SHELL = 80; // First shell (1s orbital)
    const L_SHELL = 140; // Second shell (2s, 2p orbitals)
    const M_SHELL = 200; // Third shell (3s, 3p, 3d orbitals)

    // Real atomic structures based on proper Bohr model
    this.levels = [
      {
        name: "Hydrogen (H)",
        element: "H",
        atomicNumber: 1,
        description: "1 electron in K shell (1s orbital)",
        funFact:
          "Hydrogen is the most abundant element in the universe! Each electron has an intrinsic quantum property called 'spin' - either spin-up (↑) or spin-down (↓).",
        shells: [K_SHELL], // K shell only
        orbitals: [
          shell(K_SHELL, 0, "blue", G3, 0.025), // 1s¹ (spin-down)
        ],
      },
      {
        name: "Helium (He)",
        element: "He",
        atomicNumber: 2,
        description: "2 electrons fill the K shell (1s orbital)",
        funFact:
          "Helium demonstrates the Pauli Exclusion Principle - each orbital can hold exactly 2 electrons, but they must have opposite spins (↑↓)!",
        shells: [K_SHELL], // K shell only
        orbitals: [
          shell(K_SHELL, 0, "blue", G4, 0.022), // 1s¹ (spin-down)
          shell(K_SHELL, Math.PI, "orange", G4, 0.022), // 1s² (spin-up)
        ],
      },
      {
        name: "Lithium (Li)",
        element: "Li",
        atomicNumber: 3,
        description: "K shell filled (2e⁻), 1 electron in L shell",
        funFact:
          "Lithium's 3rd electron goes into the L shell because the K shell is full with its spin-paired electrons (↑↓)!",
        shells: [K_SHELL, L_SHELL], // K and L shells
        orbitals: [
          shell(K_SHELL, 0, "blue", G4, 0.022), // 1s¹ (spin-down)
          shell(K_SHELL, Math.PI, "orange", G4, 0.022), // 1s² (spin-up)
          shell(L_SHELL, 0, "orange", Gsharp4, 0.022), // 2s¹ (spin-up)
        ],
      },
      {
        name: "Carbon (C)",
        element: "C",
        atomicNumber: 6,
        description: "K shell: 2e⁻, L shell: 4e⁻ (2s² 2p²)",
        funFact:
          "Carbon's 2p electrons follow Hund's Rule - they occupy separate orbitals with parallel spins (↑ ↑) before pairing up!",
        shells: [K_SHELL, L_SHELL], // K and L shells
        orbitals: [
          shell(K_SHELL, 0, "blue", G4, 0.022), // 1s¹ (spin-down)
          shell(K_SHELL, Math.PI, "orange", G4, 0.022), // 1s² (spin-up)
          shell(L_SHELL, 0, "blue", Gsharp4, 0.02), // 2s¹ (spin-down)
          shell(L_SHELL, Math.PI, "orange", Gsharp4, 0.02), // 2s² (spin-up)
          shell(L_SHELL, Math.PI / 2, "orange", A4, 0.02), // 2p¹ (spin-up)
          shell(L_SHELL, (3 * Math.PI) / 2, "orange", A4, 0.02), // 2p² (spin-up)
        ],
      },
      {
        name: "Nitrogen (N)",
        element: "N",
        atomicNumber: 7,
        description: "K shell: 2e⁻, L shell: 5e⁻ (2s² 2p³)",
        funFact:
          "Nitrogen has maximum unpaired electrons in its 2p orbitals (↑ ↑ ↑), making it very stable and unreactive!",
        shells: [K_SHELL, L_SHELL], // K and L shells
        orbitals: [
          shell(K_SHELL, 0, "blue", G4, 0.022), // 1s¹ (spin-down)
          shell(K_SHELL, Math.PI, "orange", G4, 0.022), // 1s² (spin-up)
          shell(L_SHELL, 0, "blue", Gsharp4, 0.022), // 2s¹ (spin-down)
          shell(L_SHELL, Math.PI, "orange", Gsharp4, 0.022), // 2s² (spin-up)
          shell(L_SHELL, Math.PI / 2, "orange", A4, 0.022), // 2p¹ (spin-up)
          shell(L_SHELL, (3 * Math.PI) / 2, "orange", A4, 0.022), // 2p² (spin-up)
          shell(L_SHELL, Math.PI / 4, "orange", A4, 0.022), // 2p³ (spin-up)
        ],
      },
    ];

    this.showingTip = false;
    this.tipStartTime = 0;
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
      electronAngle: 0, // Angle for electron orbiting around the orbital edge
      stunned: false,
      stunnedTime: 0,
      hitCount: 0,
      shaking: false,
      shakeTime: 0,
      shakeOffsetX: 0,
      shakeOffsetY: 0,
    }));
    this.time = 0;
    this.timeWarningPlayed = false; // Reset time warning for new level
  }

  checkCompletion() {
    return this.orbitals.every((o) => o.occupied);
  }

  update() {
    const M = Math; // Shorter reference
    this.time += 1 / 60; // Assuming 60fps

    // Auto-hide educational tip after 4 seconds
    if (this.showingTip && this.time - this.tipStartTime > 4) {
      this.showingTip = false;
    }

    // Update rotating orbitals
    for (let orbital of this.orbitals) {
      if (orbital.rotate) {
        orbital.angle += orbital.speed;
      }

      // Update electron orbiting motion for occupied orbitals
      if (orbital.occupied) {
        orbital.electronAngle += orbital.speed * 3; // Electrons orbit faster than gap rotation
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

    // Play stun sound
    if (this.audio) {
      this.audio.playOrbitalStun();
    }
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

      // Show educational tip
      this.showingTip = true;
      this.tipStartTime = this.time;

      this.currentLevel++;
      if (this.currentLevel >= this.levels.length) {
        this.currentLevel = 0; // Loop back
      }
      this.resetLevel();
      return true;
    }
    return false;
  }

  // Close educational tip
  closeTip() {
    this.showingTip = false;
  }

  draw(ctx) {
    // Color helpers for smaller code
    const colors = {
      blue: ["rgba(100,150,255,", "rgb(100,150,255)", "rgb(80,120,200)"],
      orange: ["rgba(255,150,100,", "rgb(255,150,100)", "rgb(200,120,80)"],
      grey: "rgb(128,128,128)",
    };

    const level = this.levels[this.currentLevel];
    const CX = this.canvas.width / 2;
    const CY = this.canvas.height / 2;

    // Draw nucleus at center
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 100, 0.8)";
    ctx.shadowBlur = 15;

    let nucleusGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 15);
    nucleusGrad.addColorStop(0, "rgb(255, 255, 150)");
    nucleusGrad.addColorStop(0.7, "rgb(255, 200, 100)");
    nucleusGrad.addColorStop(1, "rgb(200, 150, 50)");

    ctx.fillStyle = nucleusGrad;
    ctx.beginPath();
    ctx.arc(CX, CY, 12, 0, this.TAU);
    ctx.fill();

    // Nucleus label
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgb(50, 50, 50)";
    ctx.font = "10px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(level.element, CX, CY + 3);
    ctx.textAlign = "left";
    ctx.restore();

    // Draw electron shells as concentric circles around nucleus
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Draw visible shell rings for the current element
    const levelData = this.levels[this.currentLevel];
    if (levelData.shells) {
      for (let shellRadius of levelData.shells) {
        ctx.save();
        ctx.strokeStyle = "rgba(100, 150, 255, 0.25)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, this.TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
    }

    // Draw orbital targets on each shell
    for (let orbital of this.orbitals) {
      ctx.save();

      let c = colors[orbital.type] || colors.grey;
      let occ = orbital.occupied;
      let stunned = orbital.stunned;

      // Draw orbital boundary (always visible as outline)
      const orbitalRadius = 20; // Larger, more visible orbital size

      // Orbital outline ring - colored based on orbital type
      if (occ) {
        // Occupied orbitals keep the faint colored outline
        ctx.strokeStyle = stunned ? "rgba(120,120,120,0.4)" : c[0] + "0.4)";
      } else {
        // Empty orbitals have a more visible colored outline to show which electron type is needed
        ctx.strokeStyle = stunned ? "rgba(120,120,120,0.6)" : c[0] + "0.7)";
      }
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(orbital.x, orbital.y, orbitalRadius, 0, this.TAU);
      ctx.stroke();

      // Subtle orbital field background
      let fieldGrad = ctx.createRadialGradient(
        orbital.x,
        orbital.y,
        0,
        orbital.x,
        orbital.y,
        orbitalRadius
      );
      fieldGrad.addColorStop(
        0,
        stunned ? "rgba(100,100,100,0.05)" : c[0] + "0.05)"
      );
      fieldGrad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = fieldGrad;
      ctx.beginPath();
      ctx.arc(orbital.x, orbital.y, orbitalRadius, 0, this.TAU);
      ctx.fill();

      if (occ) {
        // Occupied orbital - electron orbiting around the edge
        const electronOrbitRadius = orbitalRadius - 2; // Slightly inside the orbital boundary

        // Calculate electron position
        let electronX =
          orbital.x + Math.cos(orbital.electronAngle) * electronOrbitRadius;
        let electronY =
          orbital.y + Math.sin(orbital.electronAngle) * electronOrbitRadius;

        // Apply shake offset to the entire orbital system
        electronX += orbital.shakeOffsetX;
        electronY += orbital.shakeOffsetY;

        // Draw orbiting electron
        ctx.shadowColor = c[0] + "0.8)";
        ctx.shadowBlur = 8;

        let grad = ctx.createRadialGradient(
          electronX,
          electronY,
          0,
          electronX,
          electronY,
          6
        );
        grad.addColorStop(0, "white");
        grad.addColorStop(0.4, c[1]);
        grad.addColorStop(1, c[2]);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(electronX, electronY, 6, 0, this.TAU);
        ctx.fill();

        // Optional: Draw faint orbital trail
        ctx.shadowBlur = 0;
        ctx.strokeStyle = c[0] + "0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(orbital.x, orbital.y, electronOrbitRadius, 0, this.TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Available orbital - show rotating entry gap
        ctx.translate(orbital.x, orbital.y);
        ctx.rotate(orbital.angle);

        // Entry gap in the orbital ring
        ctx.strokeStyle = stunned
          ? "rgba(200,200,200,0.8)"
          : c[1].replace("rgb", "rgba").replace(")", ",0.9)");
        ctx.lineWidth = 3;
        ctx.beginPath();
        let g = orbital.gap / 2;
        ctx.arc(0, 0, orbitalRadius, g, this.TAU - g);
        ctx.stroke();

        // Entry gap indicators (pointing inward)
        ctx.strokeStyle = stunned
          ? "rgba(160,160,160,0.9)"
          : c[1].replace("rgb", "rgba").replace(")", ",0.8)");
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(orbitalRadius * Math.cos(g), orbitalRadius * Math.sin(g));
        ctx.lineTo(
          (orbitalRadius - 6) * Math.cos(g),
          (orbitalRadius - 6) * Math.sin(g)
        );
        ctx.moveTo(orbitalRadius * Math.cos(-g), orbitalRadius * Math.sin(-g));
        ctx.lineTo(
          (orbitalRadius - 6) * Math.cos(-g),
          (orbitalRadius - 6) * Math.sin(-g)
        );
        ctx.stroke();

        // Center indicator dot
        let pulse = 0.3 + 0.3 * Math.sin(this.time * 2.5);
        ctx.fillStyle = stunned
          ? `rgba(140,140,140,${pulse})`
          : c[0] + `${pulse})`;
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, this.TAU);
        ctx.fill();
      }

      ctx.restore();
    }

    // UI Constants
    const F16 = "16px Arial";
    const F18 = "18px 'Courier New', monospace";
    const F12 = "12px Arial";
    const WHITE = "white";
    const CYAN = "rgb(0, 255, 255)";
    const YELLOW = "rgb(255, 255, 100)";

    const currentLevel = this.levels[this.currentLevel];

    // Element name and atomic number
    ctx.fillStyle = WHITE;
    ctx.font = F18;
    ctx.fillText(`${currentLevel.name}`, 20, 30);

    // Atomic number in a styled box
    ctx.save();
    ctx.fillStyle = "rgba(100, 150, 255, 0.2)";
    ctx.fillRect(200, 10, 40, 30);
    ctx.strokeStyle = "rgb(100, 150, 255)";
    ctx.lineWidth = 1;
    ctx.strokeRect(200, 10, 40, 30);

    ctx.fillStyle = CYAN;
    ctx.font = "14px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(currentLevel.atomicNumber.toString(), 220, 30);
    ctx.textAlign = "left";
    ctx.restore();

    // Score text with muted styling like element name
    ctx.fillStyle = WHITE;
    ctx.font = F18;
    ctx.fillText(`SCORE: ${this.score}`, 20, 55);

    ctx.fillStyle = WHITE;
    ctx.font = F18;
    ctx.fillText(
      `Electrons: ${this.orbitals.filter((o) => o.occupied).length}/${
        this.orbitals.length
      }`,
      20,
      75
    );

    // Timer display
    let timeLeft = Math.max(0, this.levelTime - this.time);
    ctx.fillStyle = timeLeft < 10 ? "rgb(255,100,100)" : "white";
    ctx.fillText(`Time: ${timeLeft.toFixed(1)}s`, 20, 95);

    // Play time warning sound when 10 seconds left (only once per level)
    if (
      timeLeft <= 10 &&
      timeLeft > 0 &&
      !this.timeWarningPlayed &&
      this.audio
    ) {
      this.audio.playTimeWarning();
      this.timeWarningPlayed = true;
    }

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

    // Educational tip overlay
    if (this.showingTip) {
      const prevLevel =
        this.currentLevel === 0
          ? this.levels.length - 1
          : this.currentLevel - 1;
      const completedLevel = this.levels[prevLevel];

      // Semi-transparent overlay
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Educational tip box
      const boxWidth = 500;
      const boxHeight = 200;
      const boxX = (this.canvas.width - boxWidth) / 2;
      const boxY = (this.canvas.height - boxHeight) / 2;

      // Tip box background
      ctx.fillStyle = "rgba(20, 30, 50, 0.95)";
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

      // Tip box border
      ctx.strokeStyle = "rgb(100, 150, 255)";
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      ctx.textAlign = "center";

      // Congratulations header
      ctx.fillStyle = "rgb(255, 255, 100)";
      ctx.font = "24px 'Courier New', monospace";
      ctx.fillText("ELEMENT BUILT!", this.canvas.width / 2, boxY + 40);

      // Element details
      ctx.fillStyle = "rgb(100, 200, 255)";
      ctx.font = "20px 'Courier New', monospace";
      ctx.fillText(
        `${completedLevel.name} (${completedLevel.element})`,
        this.canvas.width / 2,
        boxY + 70
      );

      ctx.fillStyle = "rgb(200, 200, 200)";
      ctx.font = "16px Arial";
      ctx.fillText(
        `Atomic Number: ${completedLevel.atomicNumber}`,
        this.canvas.width / 2,
        boxY + 95
      );

      // Fun fact
      ctx.fillStyle = "rgb(255, 200, 100)";
      ctx.font = "14px Arial";

      // Word wrap the fun fact
      const words = completedLevel.funFact.split(" ");
      let line = "";
      let lineY = boxY + 125;

      for (let word of words) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);

        if (metrics.width > boxWidth - 40 && line !== "") {
          ctx.fillText(line, this.canvas.width / 2, lineY);
          line = word + " ";
          lineY += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, this.canvas.width / 2, lineY);

      // Auto-close instruction
      ctx.fillStyle = "rgba(150, 150, 150, 0.8)";
      ctx.font = "12px Arial";
      ctx.fillText(
        "(Auto-closes in " +
          Math.ceil(4 - (this.time - this.tipStartTime)) +
          "s | Click anywhere or press ESC to close)",
        this.canvas.width / 2,
        boxY + boxHeight - 15
      );

      ctx.restore();
    }
  }
}
