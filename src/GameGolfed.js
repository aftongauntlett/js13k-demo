class G {
  constructor() {
    this.c = document.getElementById("gameCanvas");
    this.ctx = this.c.getContext("2d");
    this.easyMode = localStorage.getItem("easyMode") === "1";
    this.pausedAt = 0;

    if (localStorage.getItem("easyMode") === null) {
      localStorage.setItem("easyMode", "0");
      this.easyMode = false;
    }

    if (this.easyMode) {
      this.pausedAt = 0;
    }

    this.input = { mouse: { x: 400, y: 300 } };
    this.c.addEventListener("mousemove", (e) => {
      let rect = this.c.getBoundingClientRect();
      this.input.mouse.x = e.clientX - rect.left;
      this.input.mouse.y = e.clientY - rect.top;
    });

    this.audio = new A();
    this.o = new O(this.c, this.audio, this);
    this.tutorial = new T(this);
    this.glossary = new Glossary();

    this.electrons = [];
    this.particles = [];

    this.spawn();
    this.spawnParticles();

    this.c.addEventListener("click", async (e) => {
      if (!this.audio.c) {
        await this.audio.i();
        this.audio.m();
      }

      if (this.o.tip) {
        this.o.tip = 0;
        this.audio.p(5, 0.6);
        return;
      }

      let timeLeft = Math.max(0, this.o.T - this.o.t);
      if (!this.easyMode && timeLeft <= 0) {
        this.audio.p(6, 0.7);
        this.o.r();
        this.spawn();
      } else if (this.o.checkComplete()) {
        this.audio.p(7, 0.8);
        this.o.nextLevel();
        this.spawn();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.o.tip) {
          this.o.tip = 0;
        } else if (this.glossary.isVisible()) {
          this.glossary.hide();
        } else {
          this.tutorial.v ? this.tutorial.hide() : this.tutorial.show();
        }
      } else if (e.key === "m" || e.key === "M") {
        this.audio.t();
      } else if (e.key === "t" || e.key === "T") {
        if (!this.easyMode) {
          this.pausedAt = this.o.t;
        } else {
          this.o.t = this.pausedAt;
        }
        this.easyMode = !this.easyMode;
        localStorage.setItem("easyMode", this.easyMode ? "1" : "0");
      }
    });

    this.loop();

    setTimeout(() => {
      if (this.tutorial.shouldShow()) this.tutorial.show();
    }, 1000);
  }

  spawn() {
    this.electrons = [];
    let types = [0, 1];
    types.forEach((type) => {
      let count = this.o.o.filter((o) => o.type === type).length;
      for (let i = 0; i < count; i++) {
        let x,
          y,
          attempts = 0;
        do {
          x = Math.random() * (this.c.width - 200) + 100;
          y = Math.random() * (this.c.height - 200) + 100;
          attempts++;
        } while (attempts < 10 && this.nearOrbital(x, y, 60));

        this.electrons.push(new E(x, y, type, this.audio));
      }
    });
  }

  respawn(type) {
    let x,
      y,
      attempts = 0;
    do {
      x = Math.random() * (this.c.width - 200) + 100;
      y = Math.random() * (this.c.height - 200) + 100;
      attempts++;
    } while (attempts < 10 && this.nearOrbital(x, y, 60));

    let e = new E(x, y, type, this.audio);
    e.vx = (Math.random() - 0.5) * 3;
    e.vy = (Math.random() - 0.5) * 3;
    this.electrons.push(e);
  }

  nearOrbital(x, y, minDist) {
    return this.o.o.some((o) => {
      let dx = x - o.x,
        dy = y - o.y;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }

  spawnParticles() {
    this.particles = [];
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * this.c.width,
        y: Math.random() * this.c.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        phase: Math.random() * 6.28,
        size: Math.random() * 1.5 + 0.5,
      });
    }
  }

  update() {
    this.o.u();

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.02;

      if (p.x < 0) p.x = this.c.width;
      if (p.x > this.c.width) p.x = 0;
      if (p.y < 0) p.y = this.c.height;
      if (p.y > this.c.height) p.y = 0;
    }

    for (let e of this.electrons) {
      e.u(this.input.mouse, this.o.o, this.o);

      this.o.applyStormForces(e);
    }
  }

  draw() {
    this.ctx.fillStyle = "rgb(10,10,20)";
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);

    this.ctx.save();
    for (let p of this.particles) {
      let twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(p.phase));
      this.ctx.fillStyle = `rgba(200,220,255,${p.alpha * twinkle})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, 6.28);
      this.ctx.fill();
    }
    this.ctx.restore();

    if (!this.o.tip) {
      let ctx = this.ctx;
      ctx.save();
      ctx.translate(this.input.mouse.x, this.input.mouse.y);

      let time = Date.now() * 0.003;

      ctx.shadowColor = "rgba(0,255,255,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.arc(0, 0, 5 + Math.sin(time) * 0.8, 0, 6.28);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(0,255,255,0.8)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        let baseAngle = (time * 0.5 + i * 1.3) % 6.28;
        let randomOffset =
          Math.sin(time * 3 + i * 2.7) * 0.8 + (Math.random() - 0.5) * 1.2;
        let angle = baseAngle + randomOffset;

        let length = 4 + Math.random() * 6 + Math.sin(time * 2 + i) * 2;

        ctx.beginPath();
        ctx.moveTo(0, 0);

        let segments = 2 + Math.floor(Math.random() * 2);
        let x = 0,
          y = 0;

        for (let seg = 0; seg < segments; seg++) {
          let segmentLength = length / segments;
          let segmentAngle = angle + (Math.random() - 0.5) * 0.4;
          x += Math.cos(segmentAngle) * segmentLength;
          y += Math.sin(segmentAngle) * segmentLength;
          ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      ctx.restore();
    }

    this.o.d(this.ctx);

    if (!this.o.tip) {
      for (let e of this.electrons) {
        e.d(this.ctx);
      }
    }

    this.ctx.fillStyle = "rgba(255,255,255,.7)";
    this.ctx.font = "12px monospace";
    this.ctx.fillText(
      "Blue=s Orange=p phases | M:Mute T:Timer ESC:Tutorial",
      20,
      580
    );
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  start() {}
}
