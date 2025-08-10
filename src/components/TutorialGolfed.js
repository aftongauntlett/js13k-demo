// Ultra-golfed tutorial system for JS13K
class T {
  constructor(g) {
    this.g = g;
    this.v = 0;
    this.s = 0;
    this.o = null;
    this.h = localStorage.getItem("t") === "1";
    // Compact text data - indexed strings
    this.t = [
      "Welcome to Atomic Assembly!",
      "Learn Real Atomic Physics!",
      "Build atoms by placing electrons in correct orbitals",
      "Understanding Electron Spins",
      "Blue = Spin-Down, Orange = Spin-Up",
      "Each orbital holds max 2 electrons with opposite spins",
      "How to Play",
      "Mouse attracts/repels electrons - use physics!",
      "Match electron colors to orbital colors",
      "Time limit - complete before timeout",
      "Pro Tips",
      "Pauli Exclusion: max 2 electrons per orbital",
      "Hund's Rule: fill empty orbitals first",
      "Listen for audio feedback",
      "Continue",
      "Start Game",
    ];
    // Step data: [title_idx, content_start_idx, content_count, button_idx]
    this.d = [
      [0, 1, 2, 14],
      [3, 4, 1, 14],
      [6, 7, 2, 14],
      [10, 11, 3, 15],
    ];
  }

  show() {
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
    this.o = document.createElement("div");
    // Minimal inline styling
    this.o.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.9);display:flex;justify-content:center;align-items:center;z-index:1000;font:12px monospace;color:#ccc";

    this.o.innerHTML = `<div style="background:#111;border:2px solid #69f;width:90%;max-width:500px;max-height:80vh;overflow:auto">
      <div style="display:flex;justify-content:space-between;padding:15px;border-bottom:1px solid #69f;background:#222">
        <span>${this.s + 1}/4</span>
        <button onclick="tutorial.hide()" style="background:#333;border:1px solid #69f;color:#69f;padding:5px 10px">X</button>
      </div>
      <div style="padding:20px">
        <h2 style="color:#ff6;margin:0 0 15px;font-size:18px" class="title"></h2>
        <div class="content" style="line-height:1.5"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;padding:15px;border-top:1px solid #69f;background:#222">
        <button onclick="tutorial.prev()" style="background:#333;border:1px solid #69f;color:#fa0;padding:8px 16px;margin-right:auto;display:none" class="prev">Previous</button>
        <button onclick="tutorial.next()" style="background:#333;border:1px solid #69f;color:#69f;padding:8px 16px" class="next">Next</button>
      </div>
    </div>`;

    document.body.appendChild(this.o);
  }

  u() {
    if (!this.o) return;
    let step = this.d[this.s];
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
    if (this.s < 3) {
      this.s++;
      this.u();
    } else {
      this.hide();
      if (this.g && this.g.start) this.g.start();
    }
  }

  prev() {
    if (this.s > 0) {
      this.s--;
      this.u();
    }
  }

  shouldShow() {
    return !this.h;
  }
}
