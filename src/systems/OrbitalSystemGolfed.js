// Ultra-golfed orbital system for JS13K
class O {
  constructor(c, a) {
    this.c = c;
    this.l = 0;
    this.s = 0;
    this.t = 0;
    this.T = 45;
    this.a = a;
    this.w = 0;
    this.k = null;
    this.tip = 0;
    this.ts = 0;

    // Compact level data with proper shell positioning
    // [name,atomicNum,shells,orbitalData] - orbitalData: [x,y,radius,type,gap,speed,shellRadius]
    let CX = 400,
      CY = 300; // Center coordinates
    this.L = [
      ["Hydrogen", 1, [80], [[CX + 80, CY, 80, 0, 0.3, 0.02, 80]]],
      [
        "Helium",
        2,
        [80],
        [
          [CX + 80, CY, 80, 0, 0.3, 0.02, 80],
          [CX - 80, CY, 80, 0, 0.3, 0.02, 80],
        ],
      ],
      [
        "Lithium",
        3,
        [80, 140],
        [
          [CX + 80, CY, 80, 0, 0.3, 0.02, 80],
          [CX - 80, CY, 80, 0, 0.3, 0.02, 80],
          [CX + 140, CY, 140, 0, 0.25, 0.022, 140],
        ],
      ],
      [
        "Carbon",
        6,
        [80, 140],
        [
          [CX + 80, CY, 80, 0, 0.3, 0.02, 80],
          [CX - 80, CY, 80, 0, 0.3, 0.02, 80],
          [CX + 140, CY, 140, 0, 0.25, 0.022, 140],
          [CX - 140, CY, 140, 0, 0.25, 0.022, 140],
          [CX, CY + 140, 140, 1, 0.25, 0.022, 140],
          [CX, CY - 140, 140, 1, 0.25, 0.022, 140],
        ],
      ],
      [
        "Nitrogen",
        7,
        [80, 140],
        [
          [CX + 80, CY, 80, 0, 0.3, 0.02, 80],
          [CX - 80, CY, 80, 0, 0.3, 0.02, 80],
          [CX + 140, CY, 140, 0, 0.25, 0.022, 140],
          [CX - 140, CY, 140, 0, 0.25, 0.022, 140],
          [CX, CY + 140, 140, 1, 0.25, 0.022, 140],
          [CX, CY - 140, 140, 1, 0.25, 0.022, 140],
          [CX + 99, CY + 99, 140, 1, 0.25, 0.022, 140],
        ],
      ],
    ];

    // Facts compressed - with line breaks for better display
    this.F = [
      "Simplest atom - just 1 proton\nand 1 electron",
      "Noble gas - completely filled\nelectron shell",
      "Alkali metal - very reactive\ndue to single outer electron",
      "Forms 4 bonds - basis of\nall organic chemistry",
      "Essential for proteins\nand DNA",
    ];

    this.r();
  }

  setMouse(x, y) {
    this.m = { x, y };
  }

  r() {
    let lvl = this.L[this.l];
    this.o = [];
    for (let i = 0; i < lvl[3].length; i++) {
      let d = lvl[3][i];
      this.o.push({
        x: d[0],
        y: d[1],
        r: d[2],
        type: d[3],
        gap: d[4],
        speed: d[5],
        shellR: d[6] || d[2], // Shell radius for drawing
        angle: Math.random() * 6.28,
        occupied: 0,
        stunned: 0,
        eAngle: 0,
        baseSpeed: d[5], // Store original speed for capture cone
        inCone: 0, // For capture assistance
      });
    }
    this.t = 0;
    this.w = 0;
  }

  update() {
    this.t += 1 / 60;
    for (let orb of this.o) {
      // Speed management for orange orbs
      if (orb.type === 1 && !orb.occupied) {
        // Impulse tap mechanic - slow down when mouse is near
        let mouseX = this.m?.x || 0;
        let mouseY = this.m?.y || 0;
        let dx = mouseX - orb.x;
        let dy = mouseY - orb.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          // Create capture cone effect
          orb.inCone = Math.max(0.5, orb.inCone);
          orb.speed = orb.baseSpeed * 0.3; // 70% slower
        } else {
          orb.inCone = Math.max(0, orb.inCone - 0.02);
          orb.speed = orb.baseSpeed * (0.3 + 0.7 * (1 - orb.inCone));
        }
      }

      orb.angle += orb.speed;
      if (orb.occupied) orb.eAngle += 0.05;
      if (orb.stunned > 0) orb.stunned -= 1 / 60;
    }
    if (this.tip && this.t - this.ts > 4) this.tip = 0;
  }

  checkComplete() {
    return this.o.filter((o) => o.occupied).length === this.o.length;
  }

  canEnter(orb, x, y) {
    if (orb.occupied || orb.stunned > 0.1) return 0;
    let dx = x - orb.x,
      dy = y - orb.y,
      dist = Math.sqrt(dx * dx + dy * dy);

    // Collision should be with the 20px orbital ring, not the shell
    let orbitalRadius = 20;
    let maxDist = orb.type === 1 ? 25 : 22; // Orange orbs get slightly larger zone
    let minDist = orb.type === 1 ? 15 : 18;

    if (dist > maxDist || dist < minDist) return 0;

    let angle = Math.atan2(dy, dx);
    let diff = Math.abs(angle - orb.angle);
    if (diff > Math.PI) diff = 6.28 - diff;

    // Wider gap for orange orbs and capture assistance
    let gapSize = orb.gap;
    if (orb.type === 1) gapSize *= 1.4; // 40% wider for orange
    if (orb.inCone > 0) gapSize *= 1.2; // 20% wider when in capture cone

    return diff < gapSize / 2;
  }

  stun(orb) {
    orb.stunned = 2;
    this.a?.p(4);
  }

  hit(orb) {
    orb.hits = (orb.hits || 0) + 1;
    if (orb.hits >= 2) {
      orb.occupied = 0;
      orb.hits = 0;
      this.k = { type: orb.type, time: this.t };
      this.a?.p(2);
    } else this.a?.p(3);
  }

  nextLevel() {
    if (this.checkComplete()) {
      this.s += (this.l + 1) * 100;
      this.tip = 1;
      this.ts = this.t;
      this.l++;
      if (this.l >= this.L.length) this.l = 0;
      this.r();
      return 1;
    }
    return 0;
  }

  draw(ctx) {
    // Colors: [blue,orange]
    let colors = [
      ["rgba(100,150,255,", "rgb(100,150,255)"],
      ["rgba(255,150,100,", "rgb(255,150,100)"],
    ];
    let lvl = this.L[this.l];
    let CX = this.c.width / 2,
      CY = this.c.height / 2;

    // Shell outlines
    let shells = new Set();
    for (let orb of this.o) {
      shells.add(orb.shellR);
    }
    ctx.save();
    ctx.strokeStyle = "rgba(100,150,200,.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let r of shells) {
      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, 6.28);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    // Nucleus
    ctx.save();
    ctx.shadowColor = "rgba(255,255,100,.8)";
    ctx.shadowBlur = 15;
    let grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 15);
    grad.addColorStop(0, "rgb(255,255,150)");
    grad.addColorStop(1, "rgb(200,150,50)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(CX, CY, 12, 0, 6.28);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgb(50,50,50)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(lvl[0].charAt(0), CX, CY + 3);
    ctx.restore();

    // Orbitals
    for (let orb of this.o) {
      ctx.save();
      let c = colors[orb.type];
      let stunned = orb.stunned > 0.1;

      // Capture cone for orange orbs
      if (orb.type === 1 && orb.inCone > 0.1 && !orb.occupied) {
        ctx.save();
        ctx.strokeStyle = `rgba(255,150,100,${orb.inCone * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 80, 0, 6.28);
        ctx.stroke();
        ctx.restore();
      }

      // Orbital ring with enhanced capture zone for orange
      let ringOpacity = orb.type === 1 && orb.inCone > 0.1 ? 0.9 : 0.7;
      ctx.strokeStyle = stunned
        ? "rgba(120,120,120,.6)"
        : c[0] + `${ringOpacity})`;
      ctx.lineWidth = orb.type === 1 && orb.inCone > 0.1 ? 3 : 2;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 20, 0, 6.28);
      ctx.stroke();

      if (orb.occupied) {
        // Electron orbiting
        let ex = orb.x + Math.cos(orb.eAngle) * 18;
        let ey = orb.y + Math.sin(orb.eAngle) * 18;
        let eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8);
        eGrad.addColorStop(0, c[1]);
        eGrad.addColorStop(1, c[1].replace("rgb", "rgba").replace(")", ",0)"));
        ctx.fillStyle = eGrad;
        ctx.beginPath();
        ctx.arc(ex, ey, 8, 0, 6.28);
        ctx.fill();
      } else {
        // Entry gap
        ctx.translate(orb.x, orb.y);
        ctx.rotate(orb.angle);
        ctx.strokeStyle = stunned
          ? "rgba(200,200,200,.8)"
          : c[1].replace("rgb", "rgba").replace(")", ".9)");
        ctx.lineWidth = 3;
        ctx.beginPath();
        let g = orb.gap / 2;
        ctx.arc(0, 0, 20, g, 6.28 - g);
        ctx.stroke();

        // Gap indicators
        ctx.strokeStyle = stunned
          ? "rgba(160,160,160,.9)"
          : c[1].replace("rgb", "rgba").replace(")", ".8)");
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20 * Math.cos(g), 20 * Math.sin(g));
        ctx.lineTo(14 * Math.cos(g), 14 * Math.sin(g));
        ctx.moveTo(20 * Math.cos(-g), 20 * Math.sin(-g));
        ctx.lineTo(14 * Math.cos(-g), 14 * Math.sin(-g));
        ctx.stroke();

        // Center dot
        let pulse = 0.3 + 0.3 * Math.sin(this.t * 2.5);
        ctx.fillStyle = stunned
          ? `rgba(140,140,140,${pulse})`
          : c[0] + `${pulse})`;
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, 6.28);
        ctx.fill();
      }
      ctx.restore();
    }

    // UI
    ctx.fillStyle = "white";
    ctx.font = "18px monospace";
    ctx.fillText(lvl[0], 20, 30);

    // Atomic number box
    ctx.fillStyle = "rgba(100,150,255,.2)";
    ctx.fillRect(200, 10, 40, 30);
    ctx.strokeStyle = "rgb(100,150,255)";
    ctx.strokeRect(200, 10, 40, 30);
    ctx.fillStyle = "rgb(0,255,255)";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(lvl[1], 220, 30);
    ctx.textAlign = "left";

    ctx.fillStyle = "white";
    ctx.font = "18px monospace";
    ctx.fillText(`SCORE: ${this.s}`, 20, 55);
    ctx.fillText(
      `Electrons: ${this.o.filter((o) => o.occupied).length}/${this.o.length}`,
      20,
      75
    );

    let timeLeft = Math.max(0, this.T - this.t);
    ctx.fillStyle = timeLeft < 10 ? "rgb(255,100,100)" : "white";
    ctx.fillText(`Time: ${timeLeft.toFixed(1)}s`, 20, 95);

    if (timeLeft <= 10 && timeLeft > 0 && !this.w && this.a) {
      this.a.p(6);
      this.w = 1;
    }

    // Completion check
    if (this.checkComplete()) {
      ctx.save();
      // Modal background
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fillRect(0, 0, this.c.width, this.c.height);

      // Modal box
      let boxW = 400,
        boxH = 120;
      let boxX = (this.c.width - boxW) / 2,
        boxY = (this.c.height - boxH) / 2;

      ctx.fillStyle = "rgba(20,30,50,.95)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgb(255,255,100)";
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Content
      ctx.textAlign = "center";
      ctx.font = "24px monospace";
      ctx.shadowColor = "rgb(255,255,0)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgb(255,255,100)";
      ctx.fillText("LEVEL COMPLETE!", this.c.width / 2, boxY + 45);

      ctx.font = "16px monospace";
      ctx.shadowColor = "rgb(0,255,255)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "rgb(100,200,255)";
      ctx.fillText(">> CLICK FOR NEXT LEVEL <<", this.c.width / 2, boxY + 75);
      ctx.restore();
    } else if (timeLeft <= 0) {
      ctx.save();
      // Modal background
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fillRect(0, 0, this.c.width, this.c.height);

      // Modal box
      let boxW = 400,
        boxH = 100;
      let boxX = (this.c.width - boxW) / 2,
        boxY = (this.c.height - boxH) / 2;

      ctx.fillStyle = "rgba(50,20,20,.95)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgb(255,100,100)";
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Content
      ctx.textAlign = "center";
      ctx.font = "20px monospace";
      ctx.shadowColor = "rgb(255,100,100)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgb(255,150,150)";
      ctx.fillText("TIME'S UP! CLICK TO RETRY", this.c.width / 2, boxY + 60);
      ctx.restore();
    }

    // Educational tip
    if (this.tip) {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fillRect(0, 0, this.c.width, this.c.height);

      let boxW = 400,
        boxH = 170; // Increased height for multi-line text
      let boxX = (this.c.width - boxW) / 2,
        boxY = (this.c.height - boxH) / 2;

      ctx.fillStyle = "rgba(20,30,50,.95)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgb(100,150,255)";
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(255,255,100)";
      ctx.font = "20px monospace";
      ctx.fillText("ELEMENT BUILT!", this.c.width / 2, boxY + 35);

      let prevIdx = this.l === 0 ? this.L.length - 1 : this.l - 1;
      ctx.fillStyle = "rgb(100,200,255)";
      ctx.font = "16px monospace";
      ctx.fillText(this.L[prevIdx][0], this.c.width / 2, boxY + 60);

      // Handle multi-line text
      ctx.fillStyle = "rgb(255,200,100)";
      ctx.font = "14px monospace";
      const lines = this.F[prevIdx].split("\n");
      lines.forEach((line, i) => {
        ctx.fillText(line, this.c.width / 2, boxY + 85 + i * 18);
      });

      ctx.fillStyle = "rgba(150,150,150,.8)";
      ctx.font = "12px monospace";
      ctx.fillText(
        `(Auto-closes in ${Math.ceil(4 - (this.t - this.ts))}s)`,
        this.c.width / 2,
        boxY + 140
      );

      ctx.restore();
    }
  }
}
