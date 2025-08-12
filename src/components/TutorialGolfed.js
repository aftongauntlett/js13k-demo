class T {
  constructor(g) {
    this.g = g;
    this.v = 0;
    this.s = 0;
    this.o = null;
    this.h = localStorage.getItem("t") === "1";
    this.t = [
      "Atomic Assembly!",
      "Learn Real Physics!",
      "Place electrons in orbitals",
      "Orbital Types",
      "Blue=s, Orange=p phases",
      "Colors show wave signs",
      "Max 2 electrons per orbital",
      "How to Play",
      "Mouse attracts/repels electrons",
      "Match colors to orbitals",
      "Complete before timeout",
      "Pro Tips",
      "Pauli: max 2 per orbital",
      "Hund's: fill singly first",
      "Learn through trial",
      "Advanced",
      "Complete all for Infinite",
      "Storms create interference",
      "Navigate purple fields",
      "Continue",
      "Start Game",
    ];
    this.d = [
      [0, 1, 2, 18], // Welcome - Continue
      [3, 4, 2, 18], // Orbital Types - Continue
      [6, 7, 3, 18], // How to Play - Continue
      [10, 11, 3, 18], // Pro Tips - Continue
      [14, 15, 3, 19], // Advanced - Start Game
    ];
  }

  show() {
    if (this.v) return;
    this.v = 1;
    this.s = 0;
    this.c();
    this.u();
  }

  hide() {
    this.v = 0;
    if (this.o) {
      this.o.remove();
      this.o = null;
    }
    localStorage.setItem("t", "1");
    this.h = 1;
  }

  c() {
    if (this.o) this.o.remove();
    this.o = document.createElement("div");
    this.o.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.9);display:flex;justify-content:center;align-items:center;z-index:1000;font:12px monospace;color:#ccc";

    this.o.innerHTML = `<div style="background:#111;border:2px solid #69f;width:90%;max-width:500px">
      <div style="display:flex;justify-content:space-between;padding:15px;border-bottom:1px solid #69f;background:#222">
        <span class="step-counter">${this.s + 1}/5</span>
        <div style="display:flex;gap:10px">
          <button class="glossary-btn" style="background:#333;border:1px solid #69f;color:#69f;padding:5px 10px">📚</button>
          <button class="close-btn" style="background:#333;border:1px solid #69f;color:#69f;padding:5px 10px">X</button>
        </div>
      </div>
      <div style="padding:20px">
        <h2 style="color:#ff6;margin:0 0 15px;font-size:18px" class="title"></h2>
        <div class="content" style="line-height:1.5"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;padding:15px;border-top:1px solid #69f;background:#222">
        <button class="prev" style="background:#333;border:1px solid #69f;color:#fa0;padding:8px 16px;margin-right:auto;display:none">Previous</button>
        <button class="next" style="background:#333;border:1px solid #69f;color:#69f;padding:8px 16px">Next</button>
      </div>
    </div>`;

    let c = this.o.querySelector(".close-btn"),
      p = this.o.querySelector(".prev"),
      n = this.o.querySelector(".next"),
      g = this.o.querySelector(".glossary-btn");
    c.onclick = () => this.hide();
    p.onclick = () => this.prev();
    n.onclick = () => this.next();
    g.onclick = () => this.g?.glossary?.toggle?.();
    document.body.appendChild(this.o);
  }

  u() {
    if (!this.o) return;
    let step = this.d[this.s];
    this.o.querySelector(".step-counter").textContent = `${this.s + 1}/5`;
    this.o.querySelector(".title").textContent = this.t[step[0]];
    let content = "";
    for (let i = 0; i < step[2]; i++) {
      content += this.t[step[1] + i] + "<br>";
    }
    this.o.querySelector(".content").innerHTML = content;
    this.o.querySelector(".prev").style.display = this.s > 0 ? "block" : "none";
    this.o.querySelector(".next").textContent = this.t[step[3]];
  }

  next() {
    if (!this.v || !this.o) return;
    if (this.s < 4) {
      this.s++;
      this.u();
    } else {
      this.hide();
      setTimeout(() => this.g?.start?.(), 50);
    }
  }
  prev() {
    if (!this.v || !this.o) return;
    if (this.s > 0) {
      this.s--;
      this.u();
    }
  }

  shouldShow() {
    return !this.h && !this.v;
  }

  isVisible() {
    return this.v;
  }
}
