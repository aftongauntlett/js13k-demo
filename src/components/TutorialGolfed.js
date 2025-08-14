class T {
  constructor(g) {
    this.g = g;
    this.v = 0;
    this.o = null;
    this.h = localStorage.getItem("t") === "1";
  }

  show() {
    if (this.v) return;
    this.v = 1;
    this.c();
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

    this.o.innerHTML = `<div style="background:#111;border:2px solid #69f;width:90%;max-width:600px;max-height:80vh;display:flex;flex-direction:column">
      <div style="padding:15px;border-bottom:1px solid #69f;background:#222;display:flex;justify-content:space-between;align-items:center;flex-shrink:0">
        <h2 style="margin:0;color:#ff6">Atomic Assembly Guide</h2>
        <button style="background:#333;border:1px solid #69f;color:#69f;padding:5px 10px;cursor:pointer">✕</button>
      </div>
      <div style="padding:20px;line-height:1.4;overflow:auto;flex:1">
        <h3 style="color:#fa0;margin:0 0 10px">How to Play</h3>
        <p>• Guide electrons into orbitals with your cursor<br>
        • Blue electrons (s) are ATTRACTED to your mouse<br>
        • Orange electrons (p) are REPELLED by your mouse<br>
        • Max 2 electrons per orbital</p>
        
        <h3 style="color:#fa0;margin:20px 0 10px">Rules</h3>
        <p>• Fill inner shells before outer shells<br>
        • s orbitals must be filled before p orbitals<br>
        • Avoid hitting occupied orbitals (causes ejection penalty)<br>
        • Complete all 6 elements to unlock infinite mode<br>
        • Earn an an achievement for completing all levels the fastest<br>
        • Infinite mode features electromagnetic storms that affect electrons</p>
        
        <h3 style="color:#fa0;margin:20px 0 10px">Controls</h3>
        <p>• Mouse: attract blue electrons, repel orange ones<br>
        • M: mute/unmute audio<br>
        • ESC: this help menu</p>
        
        <h3 style="color:#fa0;margin:20px 0 10px">Elements</h3>
        <p>• <b>Hydrogen (H)</b> - Simplest atom, 1 proton, 1 electron<br>
        • <b>Helium (He)</b> - Noble gas with filled electron shell<br>
        • <b>Lithium (Li)</b> - Alkali metal, reactive outer electron<br>
        • <b>Carbon (C)</b> - Forms 4 bonds, basis of organic chemistry<br>
        • <b>Nitrogen (N)</b> - Essential for proteins and DNA<br>
        • <b>Oxygen (O)</b> - Reactive gas, forms water, supports combustion</p>
        
        <h3 style="color:#fa0;margin:20px 0 10px">Science Principles</h3>
        <p>• <b>Aufbau Principle</b> - Fill lower energy orbitals first<br>
        • <b>Pauli Exclusion</b> - Max 2 electrons per orbital<br>
        • <b>Hund's Rule</b> - Fill orbitals singly before pairing<br>
        • <b>Electron Shells</b> - Energy levels around the nucleus<br>
        • <b>s vs p Orbitals</b> - Different shapes and energy levels<br>
        • <b>Electromagnetic Storms</b> - Chaotic fields that disrupt electron movement</p>
      </div>
    </div>`;
    this.o.querySelector("button").onclick = () => this.hide();

    document.body.appendChild(this.o);
  }

  shouldShow() {
    return !this.h && !this.v;
  }

  isVisible() {
    return this.v;
  }
}
