// Ultra-golfed game for JS13K
class G {
  constructor() {
    this.c = document.getElementById("gameCanvas");
    this.ctx = this.c.getContext("2d");

    // Systems
    this.input = { mouse: { x: 400, y: 300 } };
    this.c.addEventListener("mousemove", (e) => {
      let rect = this.c.getBoundingClientRect();
      this.input.mouse.x = e.clientX - rect.left;
      this.input.mouse.y = e.clientY - rect.top;
      this.orbitals.setMouse(this.input.mouse.x, this.input.mouse.y);
    });

    this.audio = new A();
    this.orbitals = new O(this.c, this.audio);
    this.tutorial = new T(this);

    this.electrons = [];
    this.particles = [];

    this.spawn();
    this.spawnParticles();

    // Click handler
    this.c.addEventListener("click", async () => {
      if (!this.audio.c) {
        await this.audio.i();
        this.audio.m();
      }

      if (this.orbitals.tip) {
        this.orbitals.tip = 0;
        this.audio.p(5);
        return;
      }

      let timeLeft = Math.max(0, this.orbitals.T - this.orbitals.t);
      if (this.orbitals.checkComplete()) {
        this.audio.p(7); // level complete (need to add this sound)
        this.orbitals.nextLevel();
        this.spawn();
      } else if (timeLeft <= 0) {
        this.audio.p(6); // game over
        this.orbitals.r();
        this.spawn();
      }
    });

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.orbitals.tip) {
          this.orbitals.tip = 0;
        } else {
          this.tutorial.show();
        }
      } else if (e.key === "m" || e.key === "M") {
        this.audio.t();
      } else if (e.key === "r" || e.key === "R") {
        this.orbitals.l = 0;
        this.orbitals.s = 0;
        this.orbitals.r();
        this.spawn();
        this.audio.p(5);
      }
    });

    this.loop();

    // Show tutorial
    setTimeout(() => {
      if (this.tutorial.shouldShow()) this.tutorial.show();
    }, 1000);
  }

  spawn() {
    this.electrons = [];
    let types = [0, 1]; // blue,orange
    types.forEach((type) => {
      let count = this.orbitals.o.filter((o) => o.type === type).length;
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
    return this.orbitals.o.some((o) => {
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
    this.orbitals.update();

    // Check for knocked out electron respawn (simple)
    if (this.orbitals.k && this.orbitals.t >= this.orbitals.k.time) {
      this.respawn(this.orbitals.k.type);
      this.orbitals.k = null;
    }

    // Update particles
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.02;

      if (p.x < 0) p.x = this.c.width;
      if (p.x > this.c.width) p.x = 0;
      if (p.y < 0) p.y = this.c.height;
      if (p.y > this.c.height) p.y = 0;
    }

    // Update electrons
    for (let e of this.electrons) {
      e.update(
        this.input.mouse.x,
        this.input.mouse.y,
        this.orbitals.o,
        this.orbitals
      );
    }
  }

  draw() {
    this.ctx.fillStyle = "rgb(10,10,20)";
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);

    // Background particles
    this.ctx.save();
    for (let p of this.particles) {
      let twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(p.phase));
      this.ctx.fillStyle = `rgba(200,220,255,${p.alpha * twinkle})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, 6.28);
      this.ctx.fill();
    }
    this.ctx.restore();

    // Cursor glow
    if (!this.orbitals.tip) {
      this.ctx.save();
      this.ctx.shadowColor = "rgba(100,150,255,.6)";
      this.ctx.shadowBlur = 20;
      this.ctx.fillStyle = "rgba(100,150,255,.2)";
      this.ctx.beginPath();
      this.ctx.arc(this.input.mouse.x, this.input.mouse.y, 15, 0, 6.28);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.orbitals.draw(this.ctx);

    // Draw electrons
    if (!this.orbitals.tip) {
      for (let e of this.electrons) {
        e.draw(this.ctx);
      }
    }

    // Instructions
    this.ctx.fillStyle = "rgba(255,255,255,.7)";
    this.ctx.font = "12px monospace";
    this.ctx.fillText(
      "Blue↓ attract, Orange↑ repel | M:Mute R:Restart ESC:Help",
      20,
      this.c.height - 20
    );
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  start() {
    console.log("Game started");
  }
}
