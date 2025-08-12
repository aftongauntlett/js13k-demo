class O {
  constructor(c, a, g) {
    this.c = c;
    this.l = 0;
    this.s = 0;
    this.t = 0;
    this.T = 45;
    this.a = a;
    this.g = g;
    this.w = 0;
    this.k = null;
    this.tip = 0;
    this.ts = 0;
    this.cycle = 0;
    this.storms = [];
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
      "Simplest atom - 1 proton\n1 electron",
      "Noble gas - filled\nelectron shell",
      "Alkali metal - reactive\nsingle outer electron",
      "Forms 4 bonds - basis of\norganic chemistry",
      "Essential for proteins\nand DNA",
      "Reactive gas - forms water\nsupports combustion",
    ];

    this.r();
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
    this.t = 0;
    this.w = 0;

    if (this.cycle === 0) {
      this.storms = [];
    }
  }

  u() {
    if (!(this.g && this.g.easyMode)) {
      this.t += 1 / 60;
    }
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

      if (Math.random() < 0.02 && this.storms.length < 3) {
        this.createStorm();
      }
    }

    if (this.tip && this.t - this.ts > 4) this.tip = 0;
  }

  checkComplete() {
    let timeLeft = Math.max(0, this.T - this.t);
    return (
      ((this.g && this.g.easyMode) || timeLeft > 0) &&
      this.o.filter((o) => o.occupied).length === this.o.length
    );
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

    if (playSound) this.a?.p(4, 0.4);
  }

  hit(orb) {
    orb.hits = (orb.hits || 0) + 1;
    if (orb.hits >= 2) {
      if (this.g && this.g.electrons) {
        let electronFound = false;
        for (let e of this.g.electrons) {
          if (e.captured && e.type === orb.type) {
            e.captured = 0;

            let angle = Math.random() * 6.28;
            let distance = 60 + Math.random() * 20;
            e.x = orb.x + Math.cos(angle) * distance;
            e.y = orb.y + Math.sin(angle) * distance;

            let escapeSpeed = 3 + Math.random() * 2;
            e.vx = Math.cos(angle) * escapeSpeed;
            e.vy = Math.sin(angle) * escapeSpeed;

            e.inactive = 0.5;
            e.inactiveTime = 0.5;

            electronFound = true;
            break;
          }
        }
        if (!electronFound) {
        }
      }

      orb.occupied = 0;
      orb.hits = 0;
      orb.shake = 0;

      orb.stunned = 1.5;

      this.a?.p(2, 0.5);
    } else {
      orb.shake = 0.3;
      this.a?.p(4, 0.4);
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
      pulse: Math.random() * 6.28,
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
      this.s += (this.l + 1) * 100;
      this.tip = 1;
      this.ts = this.t;
      this.l++;

      if (this.l >= this.L.length) {
        this.cycle++;
        this.l = 0;
        this.T = Math.max(15, 45 - this.cycle * 5);
        this.storms = [];
      }

      this.r();
      return 1;
    }
    return 0;
  }

  d(ctx) {
    let colors = [
      ["rgba(100,150,255,", "rgb(100,150,255)"],
      ["rgba(255,150,100,", "rgb(255,150,100)"],
    ];
    let lvl = this.L[this.l];
    let f = this.o.filter((o) => o.occupied).length;
    let total = this.o.length;
    let shells = new Set();
    for (let orb of this.o) {
      shells.add(orb.shellR);
    }
    ctx.save();
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

    ctx.fillStyle = "#EEEEEE";
    ctx.font = "32px Arial";
    ctx.textAlign = "right";
    ctx.fillText(lvl[3], 790, 45);

    ctx.font = "10px Arial";
    ctx.fillText("Z = " + lvl[1], 790, 60);
    ctx.fillText("A = " + lvl[2], 790, 73);
    ctx.fillText("e⁻ = " + f + "/" + total, 790, 86);

    // Element name with glow effect
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.textAlign = "left";
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 8;
    ctx.fillText(lvl[0], 20, 30);
    ctx.shadowBlur = 0;

    // Score
    ctx.font = "16px monospace";
    ctx.fillText(`SCORE: ${this.s}`, 20, 55);

    if (this.cycle > 0) {
      ctx.fillStyle = "rgb(255,150,100)";
      ctx.font = "14px monospace";
      ctx.fillText(`CYCLE: ${this.cycle}`, 20, 80);
      ctx.fillStyle = "rgb(200,200,200)";
      ctx.fillText(`Storms: ${this.storms.length}`, 20, 100);
      ctx.fillStyle = "white";
      ctx.fillText(
        `Electrons: ${this.o.filter((o) => o.occupied).length}/${
          this.o.length
        }`,
        20,
        120
      );
    } else {
      ctx.fillStyle = "white";
      ctx.font = "14px monospace";
      ctx.fillText(
        `Electrons: ${this.o.filter((o) => o.occupied).length}/${
          this.o.length
        }`,
        20,
        80
      );
    }

    let timeLeft = Math.max(0, this.T - this.t);
    if (this.g && this.g.easyMode) {
      ctx.fillStyle = "rgb(100,255,100)";
      ctx.font = "14px monospace";
      ctx.fillText("Timer: OFF", 20, this.cycle > 0 ? 140 : 100);
    } else {
      ctx.fillStyle = timeLeft < 10 ? "rgb(255,100,100)" : "white";
      ctx.font = "14px monospace";
      ctx.fillText(
        `Timer: ${timeLeft.toFixed(1)}s`,
        20,
        this.cycle > 0 ? 140 : 100
      );
    }

    if (
      timeLeft <= 10 &&
      timeLeft > 0 &&
      !this.w &&
      this.a &&
      !(this.g && this.g.easyMode)
    ) {
      this.a.p(6, 0.7);
      this.w = 1;
    }

    if (this.checkComplete()) {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fillRect(0, 0, 800, 600);

      let boxW = 400,
        boxH = 120;
      let boxX = 200,
        boxY = 240;

      ctx.fillStyle = "rgba(20,30,50,.95)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgb(255,255,100)";
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.textAlign = "center";
      ctx.font = "24px monospace";
      ctx.shadowColor = "rgb(255,255,0)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgb(255,255,100)";

      if (this.l >= this.L.length - 1 && this.cycle === 0) {
        ctx.fillText("INFINITE MODE UNLOCKED!", 400, boxY + 45);
      } else {
        ctx.fillText("LEVEL COMPLETE!", 400, boxY + 45);
      }

      ctx.font = "16px monospace";
      ctx.shadowColor = "rgb(0,255,255)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "rgb(100,200,255)";
      ctx.fillText(">> CLICK FOR NEXT LEVEL <<", 400, boxY + 75);
      ctx.restore();
    } else if (timeLeft <= 0 && !(this.g && this.g.easyMode)) {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fillRect(0, 0, 800, 600);

      let boxW = 400,
        boxH = 100;
      let boxX = 200,
        boxY = 250;

      ctx.fillStyle = "rgba(50,20,20,.95)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgb(255,100,100)";
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.textAlign = "center";
      ctx.font = "20px monospace";
      ctx.shadowColor = "rgb(255,100,100)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgb(255,150,150)";
      ctx.fillText("TIME'S UP! CLICK TO RETRY", 400, boxY + 60);
      ctx.restore();
    }

    if (this.tip) {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fillRect(0, 0, 800, 600);

      let boxW = 400,
        boxH = 170;
      let boxX = 200,
        boxY = 215;

      ctx.fillStyle = "rgba(20,30,50,.95)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgb(100,150,255)";
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(255,255,100)";
      ctx.font = "20px monospace";
      ctx.fillText("ELEMENT BUILT!", 400, boxY + 35);

      let prevIdx = this.l === 0 ? this.L.length - 1 : this.l - 1;
      ctx.fillStyle = "rgb(100,200,255)";
      ctx.font = "16px monospace";
      ctx.fillText(this.L[prevIdx][0], 400, boxY + 60);

      ctx.fillStyle = "rgb(255,200,100)";
      ctx.font = "14px monospace";
      const lines = this.F[prevIdx].split("\n");
      lines.forEach((line, i) => {
        ctx.fillText(line, 400, boxY + 85 + i * 18);
      });

      ctx.fillStyle = "rgba(150,150,150,.8)";
      ctx.font = "12px monospace";
      ctx.fillText(
        `(Auto-closes in ${Math.ceil(4 - (this.t - this.ts))}s)`,
        400,
        boxY + 140
      );

      ctx.restore();
    }
  }
}
