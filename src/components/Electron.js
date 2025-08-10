// Simple electron with polarity-based physics
class Electron {
  constructor(x, y, type, audioSystem = null) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.type = type; // 'blue', 'orange', or 'grey'
    this.originalType = type; // Store original type for recovery
    this.radius = 8;
    this.captured = false;
    this.mouseInfluenced = false;
    this.inactive = false; // True when electron becomes grey/inactive
    this.inactiveTime = 0; // Time remaining inactive
    this.TAU = Math.PI * 2; // 2π constant for efficiency
    this.audio = audioSystem; // Reference to audio system
  }

  // Handle boundary collisions for all scenarios
  handleBoundaries(canvasWidth, canvasHeight) {
    // UI collision boundaries - invisible walls around text areas
    // Top-left UI area (level, score, timer)
    if (this.x < 220 && this.y < 120) {
      if (this.x < 220 && this.y > 110) {
        // Bottom edge of UI area
        this.y = 120;
        this.vy = Math.abs(this.vy);
      } else if (this.x > 210 && this.y < 120) {
        // Right edge of UI area
        this.x = 220;
        this.vx = Math.abs(this.vx);
      }
    }

    // Bottom instruction text area
    if (this.y > canvasHeight - 50) {
      this.y = canvasHeight - 50;
      this.vy = -Math.abs(this.vy);
    }

    // Canvas boundaries
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    }
    if (this.x > canvasWidth - this.radius) {
      this.x = canvasWidth - this.radius;
      this.vx = -Math.abs(this.vx);
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    }
    if (this.y > canvasHeight - this.radius) {
      this.y = canvasHeight - this.radius;
      this.vy = -Math.abs(this.vy);
    }
  }

  update(mouseX, mouseY, orbitals, orbitalSystem) {
    if (this.captured) return;

    const M = Math; // Shorter reference for size optimization

    // Handle inactive electron recovery
    if (this.inactive) {
      this.inactiveTime -= 1 / 60; // Decrease by 1/60th second (assuming 60fps)
      if (this.inactiveTime <= 0) {
        // Reactivate electron
        this.inactive = false;
        this.type = this.originalType;
      } else {
        // Still inactive, just update physics but no mouse interaction
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x += this.vx;
        this.y += this.vy;

        // Use shared boundary handling
        this.handleBoundaries(
          orbitalSystem.canvas.width,
          orbitalSystem.canvas.height
        );
        return;
      }
    }

    let dx = this.x - mouseX,
      dy = this.y - mouseY;
    let distance = M.sqrt(dx * dx + dy * dy);

    // Track if mouse is close enough to influence electron (only if not inactive)
    this.mouseInfluenced = distance < 150;

    if (distance > 0 && this.mouseInfluenced) {
      let force = this.type === "blue" ? -0.15 : 0.15;
      this.vx += (dx / distance) * force;
      this.vy += (dy / distance) * force;
    }

    this.vx *= 0.98;
    this.vy *= 0.98;
    this.x += this.vx;
    this.y += this.vy;

    // Play subtle gliding sound based on velocity (only when moving fast enough)
    let velocity = M.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (velocity > 2 && this.audio && M.random() < 0.03) {
      // 3% chance per frame when moving fast
      this.audio.playOrbitalGlide(velocity / 10); // Normalize velocity for sound intensity
    }

    // Get canvas bounds from orbital system
    let canvasWidth = orbitalSystem.canvas.width;
    let canvasHeight = orbitalSystem.canvas.height;

    // Handle all boundary collisions
    this.handleBoundaries(canvasWidth, canvasHeight);

    // Orbital interactions
    for (let orbital of orbitals) {
      let odx = this.x - orbital.x,
        ody = this.y - orbital.y;
      let odist = M.sqrt(odx * odx + ody * ody);

      if (odist < orbital.radius + this.radius) {
        if (orbital.occupied && !this.inactive) {
          // Hit an occupied orbital - trigger shake/knockout
          let electronKnockedOut = orbitalSystem.hitOccupiedOrbital(orbital);

          if (electronKnockedOut) {
            // Play knock out sound
            if (this.audio) {
              this.audio.playElectronKnockedOut();
            }
            // Electron will be respawned by the orbital system
          } else {
            // Just a collision, not a knockout
            if (this.audio) {
              this.audio.playOrbitalCollision();
            }
          }

          // Bounce away from orbital
          let bounceX = odx / odist,
            bounceY = ody / odist;
          this.vx = bounceX * 3;
          this.vy = bounceY * 3;
          this.x = orbital.x + bounceX * (orbital.radius + this.radius + 2);
          this.y = orbital.y + bounceY * (orbital.radius + this.radius + 2);
        } else if (orbital.type === this.type) {
          // Correct color orbital
          if (!orbital.occupied) {
            // Check if electron can enter this orbital (considers rotation gaps)
            if (
              this.mouseInfluenced &&
              orbitalSystem.canEnterOrbital(orbital, this.x, this.y)
            ) {
              // Electron can enter - capture it
              orbital.occupied = true;
              this.captured = true;
              this.x = orbital.x;
              this.y = orbital.y;

              // Play capture sound
              if (this.audio) {
                this.audio.playElectronCapture();
              }

              break;
            } else if (orbital.rotate) {
              // Rotating orbital but electron can't enter through gap - bounce
              let bounceX = odx / odist,
                bounceY = ody / odist;
              this.vx = bounceX * 3;
              this.vy = bounceY * 3;
              this.x = orbital.x + bounceX * (orbital.radius + this.radius + 2);
              this.y = orbital.y + bounceY * (orbital.radius + this.radius + 2);
            }
          }
        } else if (!orbital.occupied && !this.inactive) {
          // Wrong color orbital - make electron inactive and stun orbital
          this.inactive = true;
          this.type = "grey";
          this.mouseInfluenced = false;
          this.inactiveTime = 5; // Inactive for 5 seconds
          orbitalSystem.stunOrbital(orbital);

          // Play wrong electron sound
          if (this.audio) {
            this.audio.playWrongElectron();
          }

          // Bounce away from orbital
          let bounceX = odx / odist,
            bounceY = ody / odist;
          this.vx = bounceX * 3;
          this.vy = bounceY * 3;
          this.x = orbital.x + bounceX * (orbital.radius + this.radius + 2);
          this.y = orbital.y + bounceY * (orbital.radius + this.radius + 2);
        }
      }
    }
  }

  draw(ctx) {
    if (this.captured) return;

    const M = Math; // Shorter reference for size optimization
    ctx.save();

    // Color map for electrons
    const colors = {
      blue: ["rgba(100,150,255,0.8)", "rgb(150,200,255)", "rgb(100,150,255)"],
      orange: ["rgba(255,150,100,0.8)", "rgb(255,200,150)", "rgb(255,150,100)"],
    };

    // Add subtle glow when mouse-influenced (but not if inactive)
    if (this.mouseInfluenced && !this.inactive) {
      ctx.shadowColor = colors[this.type]
        ? colors[this.type][0]
        : "rgba(128,128,128,0.8)";
      ctx.shadowBlur = 15;
    }

    let grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );

    if (colors[this.type]) {
      let c = colors[this.type];
      grad.addColorStop(0, c[1]);
      grad.addColorStop(1, c[2]);
    } else {
      // Grey/inactive electron with recovery indicator
      if (this.inactive && this.inactiveTime > 0) {
        // Add pulsing effect as it recovers
        let pulse = 0.5 + 0.3 * M.sin(Date.now() * 0.01);
        grad.addColorStop(0, `rgba(180,180,180,${pulse})`);
        grad.addColorStop(1, `rgba(120,120,120,${pulse * 0.7})`);
      } else {
        grad.addColorStop(0, "rgb(180,180,180)");
        grad.addColorStop(1, "rgb(120,120,120)");
      }
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.TAU);
    ctx.fill();
    ctx.restore();
  }
}
