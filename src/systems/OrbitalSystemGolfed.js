class O {
  constructor(ctx, audio, gameRef) {
    this.BLUE = "rgba(100,150,255,";
    this.ORANGE = "rgba(255,150,100,";
    this.DARK_BG = "rgba(20,30,50,.95)";
    this.OVERLAY = "rgba(0,0,0,.9)";

    this.PI2 = 6.28;
    this.RND = () => Math.random();

    this.e = [];
    this.ctx = ctx;
    this.audio = audio;
    this.gameRef = gameRef;

    this.L = [
      ["Hydrogen", 1, 1.008, "H", [80], [[480, 300, 0, 80]]],
      [
        "Helium",
        2,
        4.003,
        "He",
        [80],
        [
          [480, 300, 0, 80],
          [320, 300, 0, 80],
        ],
      ],
      [
        "Lithium",
        3,
        6.941,
        "Li",
        [80, 140],
        [
          [480, 300, 0, 80],
          [320, 300, 0, 80],
          [540, 300, 0, 140],
        ],
      ],
      [
        "Carbon",
        6,
        12.011,
        "C",
        [80, 140],
        [
          [480, 300, 0, 80],
          [320, 300, 0, 80],
          [540, 300, 0, 140],
          [260, 300, 0, 140],
          [400, 440, 1, 140],
          [400, 160, 1, 140],
        ],
      ],
      [
        "Nitrogen",
        7,
        14.007,
        "N",
        [80, 140],
        [
          [480, 300, 0, 80],
          [320, 300, 0, 80],
          [540, 300, 0, 140],
          [260, 300, 0, 140],
          [400, 440, 1, 140],
          [400, 160, 1, 140],
          [499, 399, 1, 140],
        ],
      ],
      [
        "Oxygen",
        8,
        15.999,
        "O",
        [80, 140],
        [
          [480, 300, 0, 80],
          [320, 300, 0, 80],
          [540, 300, 0, 140],
          [260, 300, 0, 140],
          [400, 440, 1, 140],
          [400, 160, 1, 140],
          [499, 399, 1, 140],
          [301, 399, 1, 140],
        ],
      ],
    ];

    this.F = [
      "Simplest atom\nMakes up 75% of universe",
      "Noble gas - never reacts\nUsed in balloons & diving",
      "Lightest metal\nUsed in phone batteries",
      "Forms 4 bonds\nBase of all life on Earth",
      "Essential for DNA\nMakes up 78% of air",
      "Supports combustion\n21% of Earth's atmosphere",
    ];

    this.l = 0;
    this.cycle = 0;
    this.storms = [];
    this.startTime = Date.now();

    this.bestTimeNotification = 0;
    this.newBestTime = 0;

    this.r();
  }

  drawModal(ctx, x, y, w, h, borderColor = this.ORANGE + "1)", lineWidth = 3) {
    ctx.fillStyle = this.OVERLAY;
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = this.DARK_BG;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, w, h);
    ctx.textAlign = "center";
  }

  drawStyledText(ctx, text, x, y, font, color, shadowColor, shadowBlur) {
    ctx.font = font;
    ctx.fillStyle = color;
    if (shadowColor) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
    }
    ctx.fillText(text, x, y);
    if (shadowColor) ctx.shadowBlur = 0;
  }

  r() {
    let lvl = this.L[this.l];
    this.o = [];
    for (let i = 0; i < lvl[5].length; i++) {
      let d = lvl[5][i];
      this.o.push({
        x: d[0],
        y: d[1],
        type: d[2],
        shellR: d[3],
        occupied: 0,
        stunned: 0,
        eAngle: 0,
        hits: 0,
        shake: 0,
      });
    }

    if (this.cycle === 0) {
      this.storms = [];
      this.startTime = Date.now();
    }
  }

  u() {
    let menuOpen = (this.g && this.g.tutorial && this.g.tutorial.v) || this.tip;

    if (this.checkComplete() && !this.tip && !this.completionDelay) {
      if (this.cycle > 0) {
        this.nextLevel();
        return;
      } else {
        this.completionDelay = 1.0;
        this.shellGlow = 1;
      }
    }

    if (this.completionDelay > 0) {
      this.completionDelay -= 1 / 60;
      this.shellGlow = Math.max(0, this.shellGlow - 1 / 120);
      if (this.completionDelay <= 0) {
        this.tip = 1;
        this.shellGlow = 0;
      }
    }

    if (this.bestTimeNotification > 0) {
      this.bestTimeNotification -= 1 / 60;
      if (this.bestTimeNotification < 0) {
        this.bestTimeNotification = 0;
      }
    }

    if (!menuOpen) {
      for (let orb of this.o) {
        if (orb.occupied) orb.eAngle += 0.05;
        if (orb.stunned > 0) {
          orb.stunned -= 1 / 60;
          if (orb.stunned < 0) orb.stunned = 0;
        }
        if (orb.shake > 0) orb.shake -= 1 / 60;
      }

      if (this.cycle > 0) {
        this.uStorms();

        if (this.RND() < 0.02 && this.storms.length < 3) {
          this.createStorm();
        }
      }
    }
  }

  checkComplete() {
    return this.o.filter((o) => o.occupied).length === this.o.length;
  }

  canEnter(orb, x, y) {
    if (orb.occupied || orb.stunned > 0.1) {
      return 0;
    }

    if (!this.followsElectronConfig(orb)) {
      return 0;
    }

    let dx = x - orb.x,
      dy = y - orb.y,
      dist = Math.sqrt(dx * dx + dy * dy);

    return dist < 25;
  }

  followsElectronConfig(targetOrb) {
    let s = {
      s1: this.o.filter((o) => o.shellR === 80),
      s2: this.o.filter((o) => o.shellR === 140 && o.type === 0),
      p2: this.o.filter((o) => o.shellR === 140 && o.type === 1),
    };

    let filled = {
      s1: s.s1.filter((o) => o.occupied).length,
      s2: s.s2.filter((o) => o.occupied).length,
      p2: s.p2.filter((o) => o.occupied).length,
    };

    if (targetOrb.shellR === 80) {
      return 1;
    }

    if (targetOrb.shellR === 140) {
      if (targetOrb.type === 0) {
        let allowed = filled.s1 >= s.s1.length;
        return allowed;
      }

      if (targetOrb.type === 1) {
        if (filled.s1 < s.s1.length) {
          return false;
        }

        if (targetOrb.occupied) {
          let empty2p = s.p2.filter((o) => !o.occupied);
          let allowed = empty2p.length === 0;
          return allowed;
        }
        return true;
      }
    }

    return true;
  }

  stun(orb, playSound = true) {
    orb.stunCount = (orb.stunCount || 0) + 1;
    let baseDuration = 3.0;
    let progressiveDuration = baseDuration + (orb.stunCount - 1) * 1.5;
    let maxDuration = 8.0;

    orb.stunned = Math.min(progressiveDuration, maxDuration);

    if (playSound && this.a?.c) {
      this.a.p(4, 0.4);
    }
  }

  hit(orb) {
    orb.hits = (orb.hits || 0) + 1;

    if (orb.hits >= 2) {
      let gameElectrons = this.gameRef ? this.gameRef.electrons : null;

      if (gameElectrons) {
        let electronToEject = null;

        for (let e of gameElectrons) {
          if (e.captured && e.type === orb.type) {
            electronToEject = e;
            break;
          }
        }

        if (electronToEject) {
          let angle = this.RND() * this.PI2;
          let distance = 60 + this.RND() * 20;

          let newX = orb.x + Math.cos(angle) * distance;
          let newY = orb.y + Math.sin(angle) * distance;

          newX = Math.max(50, Math.min(750, newX));
          newY = Math.max(50, Math.min(550, newY));

          electronToEject.x = newX;
          electronToEject.y = newY;

          let escapeSpeed = 2 + this.RND() * 1.5;
          electronToEject.vx = Math.cos(angle) * escapeSpeed;
          electronToEject.vy = Math.sin(angle) * escapeSpeed;

          electronToEject.inactive = 0.5;
          electronToEject.inactiveTime = 0.5;

          electronToEject.captured = 0;
          orb.occupied = 0;
        } else {
          if (this.gameRef && this.gameRef.respawn) {
            this.gameRef.respawn(orb.type);
          }
          orb.occupied = 0;
        }
      } else {
        orb.occupied = 0;
      }

      orb.hits = 0;
      orb.shake = 0;
      orb.stunned = 1.5;

      if (this.a?.c) {
        this.a.p(2, 0.5);
      }
    } else {
      orb.shake = 0.3;
      if (this.a?.c) {
        this.a.p(4, 0.4);
      }
    }
  }

  createStorm() {
    this.storms.push({
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 300,
      r: 40,
      maxR: 100 + Math.random() * 60,
      life: 5 + Math.random() * 4,
      maxLife: 5 + Math.random() * 4,
      strength: 1.2 + Math.random() * 0.6,
      pulse: this.RND() * this.PI2,
    });
  }

  uStorms() {
    for (let i = this.storms.length - 1; i >= 0; i--) {
      let storm = this.storms[i];
      storm.life -= 1 / 60;
      storm.pulse += 0.1;

      let r = Math.max(0, Math.min(1, 1 - storm.life / storm.maxLife));
      storm.r = Math.max(10, 30 + (storm.maxR - 30) * Math.sin(r * 3.14));

      if (storm.life <= 0) {
        this.storms.splice(i, 1);
      }
    }
  }

  applyStormForces(electron) {
    if (!this.storms.length || electron.captured || electron.inactive > 0)
      return;

    for (let storm of this.storms) {
      let dx = electron.x - storm.x;
      let dy = electron.y - storm.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < storm.r && dist > 5) {
        let pulse = 0.7 + 0.3 * Math.sin(storm.pulse);
        let force = (storm.strength * pulse * (storm.r - dist)) / storm.r;
        let fx = (dx / dist) * force * 0.8;
        let fy = (dy / dist) * force * 0.8;

        electron.vx += fx;
        electron.vy += fy;
      }
    }
  }

  nextLevel() {
    if (this.checkComplete()) {
      this.tip = 0;
      this.completionDelay = 0;
      this.shellGlow = 0;
      this.l++;

      if (this.l >= this.L.length) {
        let runTime = (Date.now() - this.startTime) / 1000;

        let fastestTime = localStorage.getItem("fastestTime");
        if (!fastestTime || runTime < parseFloat(fastestTime)) {
          localStorage.setItem("fastestTime", runTime.toString());

          this.bestTimeNotification = 4.0;
          this.newBestTime = runTime;
        }

        this.cycle++;
        this.l = 0;
        this.storms = [];
        this.startTime = Date.now();
      }

      this.r();
      if (this.cycle > 0 && this.gameRef && this.gameRef.spawn) {
        this.gameRef.spawn();
      }

      return 1;
    }
    return 0;
  }

  d(ctx) {
    let colors = [
      [this.BLUE, "rgb(100,150,255)"],
      [this.ORANGE, "rgb(255,150,100)"],
    ];
    let lvl = this.L[this.l];
    let f = this.o.filter((o) => o.occupied).length;
    let total = this.o.length;
    let shells = new Set();
    for (let orb of this.o) {
      shells.add(orb.shellR);
    }
    ctx.save();
    if (this.shellGlow > 0) {
      ctx.shadowColor = `rgba(255,255,150,${this.shellGlow * 0.8})`;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = `rgba(255,255,150,${this.shellGlow * 0.9})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      [...shells].map((r) => {
        ctx.beginPath();
        ctx.arc(400, 300, r, 0, 6.28);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    }
    ctx.strokeStyle = "rgba(100,150,200,.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    [...shells].map((r) => {
      ctx.beginPath();
      ctx.arc(400, 300, r, 0, 6.28);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();
    ctx.save();
    let fillRatio = total > 0 ? f / total : 0;
    let p = lvl[1];
    let n = Math.round(lvl[2] - lvl[1]);
    let nucleons = p + n;
    for (let s = 0; s < 8; s++) {
      let sparkleAngle = (s / 8) * 6.28 + this.t * 0.3;
      let sparkleR = 18 + Math.sin(this.t * 2 + s) * 6;
      let sx = 400 + Math.cos(sparkleAngle) * sparkleR;
      let sy = 300 + Math.sin(sparkleAngle) * sparkleR;
      let sparkleAlpha = 0.1 + 0.15 * Math.sin(this.t * 3 + s * 1.5);
      ctx.fillStyle = `rgba(255,255,200,${sparkleAlpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, 6.28);
      ctx.fill();
    }
    for (let i = 0; i < nucleons; i++) {
      let angle = (i / nucleons) * 6.28 + this.t * 0.08;
      let r = 2 + Math.sin(this.t * 0.4 + i) * 3;
      let x = 400 + Math.cos(angle) * r;
      let y = 300 + Math.sin(angle) * r;

      let pulse = 1 + fillRatio * 0.08 * Math.sin(this.t * 1.5 + i);
      let nucleonRadius = (3.5 + Math.sin(this.t * 1.2 + i) * 0.5) * pulse;

      let flowAlpha = 0.4 + 0.3 * Math.sin(this.t * 0.8 + i * 2);

      if (i < p) {
        let intensity = 0.5 + fillRatio * 0.2;
        ctx.fillStyle = `rgba(255,${60 * intensity},${
          60 * intensity
        },${flowAlpha})`;
      } else {
        let intensity = 0.5 + fillRatio * 0.2;
        ctx.fillStyle = `rgba(${60 * intensity},${
          100 * intensity
        },255,${flowAlpha})`;
      }
      ctx.beginPath();
      ctx.arc(x, y, nucleonRadius, 0, 6.28);
      ctx.fill();
    }
    ctx.restore();
    for (let orb of this.o) {
      ctx.save();
      let c = colors[orb.type];
      let stunned = orb.stunned > 0.1;
      let shakeX = 0,
        shakeY = 0;
      if (orb.shake > 0) {
        let shakeIntensity = orb.shake * 6;
        shakeX = (Math.random() - 0.5) * shakeIntensity;
        shakeY = (Math.random() - 0.5) * shakeIntensity;
      }
      if (stunned) {
        ctx.save();
        let warningPulse = 0.3 + 0.4 * Math.sin(this.t * 6);
        ctx.strokeStyle = `rgba(255,50,50,${warningPulse})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(orb.x + shakeX, orb.y + shakeY, 28, 0, 6.28);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
      ctx.strokeStyle = stunned ? "rgba(80,80,80,.4)" : c[0] + "0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(orb.x + shakeX, orb.y + shakeY, 20, 0, 6.28);
      ctx.stroke();
      if (orb.occupied) {
        let ex = orb.x + shakeX + Math.cos(orb.eAngle) * 18;
        let ey = orb.y + shakeY + Math.sin(orb.eAngle) * 18;
        let eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8);
        eGrad.addColorStop(0, c[1]);
        eGrad.addColorStop(1, c[1].replace("rgb", "rgba").replace(")", ",0)"));
        ctx.fillStyle = eGrad;
        ctx.beginPath();
        ctx.arc(ex, ey, 8, 0, 6.28);
        ctx.fill();
      } else {
        if (stunned) {
          let pulse = 0.2 + 0.3 * Math.sin(this.t * 4);
          ctx.fillStyle = `rgba(100,40,40,${pulse})`;
          ctx.beginPath();
          ctx.arc(orb.x + shakeX, orb.y + shakeY, 6, 0, 6.28);
          ctx.fill();
          ctx.strokeStyle = `rgba(255,80,80,${pulse})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(orb.x + shakeX - 4, orb.y + shakeY - 4);
          ctx.lineTo(orb.x + shakeX + 4, orb.y + shakeY + 4);
          ctx.moveTo(orb.x + shakeX + 4, orb.y + shakeY - 4);
          ctx.lineTo(orb.x + shakeX - 4, orb.y + shakeY + 4);
          ctx.stroke();
        } else {
          let pulse = 0.4 + 0.4 * Math.sin(this.t * 3);
          ctx.fillStyle = c[0] + `${pulse})`;
          ctx.beginPath();
          ctx.arc(orb.x + shakeX, orb.y + shakeY, 4, 0, 6.28);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    for (let orb of this.o) {
      ctx.save();
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(200,200,200,0.7)";
      ctx.textAlign = "center";
      if (orb.shellR === 80) {
        ctx.fillText("1s", orb.x, orb.y - 35);
      } else if (orb.shellR === 140) {
        if (orb.type === 0) {
          ctx.fillText("2s", orb.x, orb.y - 35);
        } else {
          ctx.fillText("2p", orb.x, orb.y - 35);
        }
      }
      ctx.restore();
    }
    for (let storm of this.storms) {
      ctx.save();
      let lifeRatio = storm.life / storm.maxLife;
      let alpha = Math.min(0.8, lifeRatio * 1.5);
      let pulse = 0.6 + 0.4 * Math.sin(storm.pulse);
      let radius = Math.max(5, storm.r);
      ctx.strokeStyle = `rgba(255,100,255,${alpha * 0.3})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(storm.x, storm.y, radius, 0, 6.28);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,150,255,${alpha * pulse * 0.5})`;
      ctx.beginPath();
      ctx.arc(storm.x, storm.y, Math.max(3, radius * 0.3 * pulse), 0, 6.28);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    let boxX = 700,
      boxY = 20,
      boxW = 80,
      boxH = 80;
    ctx.fillStyle = "rgba(20,30,50,.9)";
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = "rgba(100,200,255,.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.fillStyle = "rgba(100,200,255,.8)";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(lvl[1], boxX + 5, boxY + 14);
    ctx.textAlign = "center";
    ctx.font = "26px monospace";
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(100,200,255,.8)";
    ctx.shadowBlur = 10;
    ctx.fillText(lvl[3], boxX + boxW / 2, boxY + 40);
    ctx.shadowBlur = 0;
    ctx.font = "9px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(lvl[0], boxX + boxW / 2, boxY + 55);
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(lvl[2].toFixed(3), boxX + boxW / 2, boxY + 70);
    ctx.restore();
    ctx.save();
    ctx.textAlign = "left";
    ctx.font = "18px monospace";
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(100,200,255,.6)";
    ctx.shadowBlur = 8;
    ctx.fillText(lvl[0], 20, 25);
    ctx.shadowBlur = 0;
    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(100,200,255,.8)";
    ctx.fillText(`Element ${lvl[3]} - Atomic #${lvl[1]}`, 20, 42);
    let runTime = (Date.now() - this.startTime) / 1000;
    ctx.textAlign = "left";
    ctx.font = "14px monospace";
    ctx.fillStyle = "rgba(220,230,240,.9)";
    ctx.fillText(`Run Time: ${runTime.toFixed(1)}s`, 20, 62);
    let fastestTime = localStorage.getItem("fastestTime");
    if (fastestTime) {
      ctx.fillStyle = "rgba(255,200,100,.9)";
      ctx.fillText(`Best Time: ${parseFloat(fastestTime).toFixed(1)}s`, 20, 80);
    }
    if (this.cycle > 0) {
      ctx.fillStyle = "rgba(255,150,100,.9)";
      ctx.fillText(`Cycle: ${this.cycle}`, 20, 98);
    }
    if (this.bestTimeNotification > 0) {
      ctx.save();
      let fadeTime = 0.5;
      let alpha = 1;
      if (this.bestTimeNotification < fadeTime) {
        alpha = this.bestTimeNotification / fadeTime;
      } else if (this.bestTimeNotification > 4.0 - fadeTime) {
        alpha = (4.0 - this.bestTimeNotification) / fadeTime;
      }
      let notifX = 300,
        notifY = 15,
        notifW = 200,
        notifH = 50;
      ctx.fillStyle = `rgba(20,30,50,${alpha * 0.95})`;
      ctx.fillRect(notifX, notifY, notifW, notifH);
      ctx.strokeStyle = `rgba(100,200,255,${alpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(notifX, notifY, notifW, notifH);
      ctx.font = "12px monospace";
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
      ctx.textAlign = "center";
      ctx.fillText("⚡ NEW BEST TIME ⚡", notifX + notifW / 2, notifY + 20);
      ctx.font = "14px monospace";
      ctx.fillStyle = `rgba(100,200,255,${alpha})`;
      ctx.fillText(
        `${this.newBestTime.toFixed(1)}s`,
        notifX + notifW / 2,
        notifY + 37
      );
      ctx.restore();
    }
    if (this.tip) {
      ctx.save();
      let boxW = 450,
        boxH = 280,
        boxX = 175,
        boxY = 160;
      this.drawModal(ctx, boxX, boxY, boxW, boxH);
      let currentElement = this.L[this.l];
      this.drawStyledText(
        ctx,
        `${currentElement[0]} Complete!`,
        400,
        boxY + 40,
        "22px monospace",
        "rgb(255,200,100)",
        "rgb(255,150,100)",
        10
      );
      ctx.font = "16px monospace";
      ctx.fillStyle = "rgb(100,200,255)";
      const lines = this.F[this.l].split("\n");
      lines.forEach((line, i) => {
        ctx.fillText(line, 400, boxY + 75 + i * 20);
      });
      this.drawStyledText(
        ctx,
        `Symbol: ${currentElement[3]} • Atomic #: ${currentElement[1]} • Mass: ${currentElement[2]}`,
        400,
        boxY + 140,
        "14px monospace",
        "rgba(200,200,200,0.9)"
      );
      let statusText =
        this.l >= this.L.length - 1 && this.cycle === 0
          ? "🎉 Infinite Mode Unlocked! 🎉"
          : "Level Complete!";
      this.drawStyledText(
        ctx,
        statusText,
        400,
        boxY + 180,
        "18px monospace",
        "rgb(255,200,100)"
      );

      // Action prompt
      this.drawStyledText(
        ctx,
        "Click to continue to next level",
        400,
        boxY + 220,
        "14px monospace",
        "rgba(100,200,255,0.8)"
      );

      ctx.restore();
    }
  }
}
