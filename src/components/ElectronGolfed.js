// Ultra-golfed electron for JS13K
class E {
  constructor(x, y, type, a) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = 0;
    this.vy = 0;
    this.r = 8;
    this.captured = 0;
    this.inactive = 0;
    this.inactiveTime = 0;
    this.a = a;
    this.lastSound = 0;
    this.mouseInfluenced = 0;
  }

  update(mx, my, orbitals, orbitalSys) {
    if (this.captured) return;

    if (this.inactive > 0) {
      this.inactive -= 1 / 60;
      this.inactiveTime = this.inactive;
      if (this.inactive <= 0) {
        this.inactive = 0;
        this.inactiveTime = 0;
      }
      return;
    }

    // Mouse interaction
    let dx = mx - this.x,
      dy = my - this.y,
      dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.mouseInfluenced = 1;
      let force = (0.3 * (120 - dist)) / 120;
      let fx = (dx / dist) * force,
        fy = (dy / dist) * force;

      if (this.type === 0) {
        // blue - attract to mouse
        this.vx += fx * 0.5;
        this.vy += fy * 0.5;
      } else {
        // orange - repel from mouse
        this.vx -= fx * 0.5;
        this.vy -= fy * 0.5;
      }
    } else this.mouseInfluenced = 0;

    // Orbital interactions
    for (let orb of orbitals) {
      if (orb.occupied || orb.stunned > 0.1) continue;

      let dx = orb.x - this.x,
        dy = orb.y - this.y,
        dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        let force = (0.1 * (60 - dist)) / 60;
        let fx = (dx / dist) * force,
          fy = (dy / dist) * force;

        if (this.type === orb.type) {
          // attract to matching orbital
          this.vx += fx;
          this.vy += fy;
        } else {
          // repel from wrong orbital
          this.vx -= fx * 0.5;
          this.vy -= fy * 0.5;
        }
      }

      // Capture check
      if (orbitalSys.canEnter(orb, this.x, this.y)) {
        if (this.type === orb.type) {
          orb.occupied = 1;
          this.captured = 1;
          this.a?.p(1);
          return;
        } else {
          orbitalSys.stun(orb);
        }
      }

      // Hit occupied orbital
      if (orb.occupied && dist < 25) {
        orbitalSys.hit(orb);
        this.inactive = 3;
        this.inactiveTime = 3;
      }
    }

    // Apply physics
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Boundaries with sound
    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    let now = Date.now();

    if (this.x < this.r) {
      this.x = this.r;
      this.vx = -this.vx * 0.8;
      this.sound(speed, now);
    }
    if (this.x > 800 - this.r) {
      this.x = 800 - this.r;
      this.vx = -this.vx * 0.8;
      this.sound(speed, now);
    }
    if (this.y < this.r) {
      this.y = this.r;
      this.vy = -this.vy * 0.8;
      this.sound(speed, now);
    }
    if (this.y > 600 - this.r) {
      this.y = 600 - this.r;
      this.vy = -this.vy * 0.8;
      this.sound(speed, now);
    }

    // UI boundaries
    if (this.x < 220 && this.y < 120) {
      if (this.y > 110) {
        this.y = 120;
        this.vy = Math.abs(this.vy);
      }
      if (this.x > 210) {
        this.x = 220;
        this.vx = Math.abs(this.vx);
      }
    }
    if (this.y > 550) {
      this.y = 550;
      this.vy = -Math.abs(this.vy);
    }
  }

  sound(speed, now) {
    if (this.a?.p && now - this.lastSound > 200) {
      this.a.p(0, Math.min(1, speed / 6));
      this.lastSound = now;
    }
  }

  draw(ctx) {
    if (this.captured) return;

    ctx.save();

    // Colors: [blue,orange]
    let colors = [
      ["rgba(100,150,255,.8)", "rgb(150,200,255)", "rgb(100,150,255)"],
      ["rgba(255,150,100,.8)", "rgb(255,200,150)", "rgb(255,150,100)"],
    ];
    let c = colors[this.type] || [
      "rgba(128,128,128,.8)",
      "rgb(180,180,180)",
      "rgb(120,120,120)",
    ];

    if (this.mouseInfluenced && !this.inactive) {
      ctx.shadowColor = c[0];
      ctx.shadowBlur = 15;
    }

    let grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.r
    );

    if (this.inactive && this.inactiveTime > 0) {
      let pulse = 0.5 + 0.3 * Math.sin(Date.now() * 0.01);
      grad.addColorStop(0, `rgba(180,180,180,${pulse})`);
      grad.addColorStop(1, `rgba(120,120,120,${pulse * 0.7})`);
    } else {
      grad.addColorStop(0, c[1]);
      grad.addColorStop(1, c[2]);
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 6.28);
    ctx.fill();

    // Spin indicator
    if (!this.inactive) {
      ctx.fillStyle = c[1];
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(this.type ? "↑" : "↓", this.x, this.y + 3);
    }

    ctx.restore();
  }
}
