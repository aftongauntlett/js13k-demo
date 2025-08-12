class Glossary {
  constructor() {
    this.v = 0;
    this.o = null;
    this.t = [
      ["s-orbital", "Spherical, lower energy", "Blue orbitals"],
      ["p-orbital", "Dumbbell-shaped", "Orange orbitals"],
      ["Wave phases", "Blue/orange = +/- regions", "Like real orbital math"],
      ["Pauli", "Max 2 electrons/orbital", "Two electrons max per ring"],
      ["Hund's Rule", "Fill singly first", "One per orbital first"],
      ["Config", "1s² 2s² 2p⁶", "Real chemistry order"],
      ["Aufbau", "Lowest energy first", "Blue before orange"],
    ];
  }

  show() {
    if (this.v) return;
    this.v = 1;
    this.c();
  }

  hide() {
    this.v = 0;
    if (this.o) this.o.remove(), (this.o = null);
  }

  c() {
    if (this.o) this.o.remove();
    this.o = document.createElement("div");
    this.o.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.9);display:flex;justify-content:center;align-items:center;z-index:1000;font:12px monospace;color:#ccc";

    let h = `<div style="background:#111;border:2px solid #69f;width:90%;max-width:400px;max-height:70vh;overflow:auto">
      <div style="padding:15px;border-bottom:1px solid #69f;background:#222;display:flex;justify-content:space-between">
        <span style="color:#ff6">📚 Terms</span>
        <button class="x" style="background:#333;border:1px solid #69f;color:#69f;padding:5px 10px">✕</button>
      </div><div style="padding:15px">`;

    this.t.forEach(
      (t) =>
        (h += `<div style="margin-bottom:10px;border-bottom:1px solid #333;padding-bottom:8px">
      <b style="color:#ff6">${t[0]}</b><br>
      <span style="color:#ccc">${t[1]}</span><br>
      <span style="color:#69f">${t[2]}</span></div>`)
    );

    h += `</div></div>`;
    this.o.innerHTML = h;
    this.o.querySelector(".x").onclick = () => this.hide();
    this.o.onclick = (e) => e.target === this.o && this.hide();
    document.body.appendChild(this.o);
  }

  toggle() {
    this.v ? this.hide() : this.show();
  }

  isVisible() {
    return this.v;
  }
}
