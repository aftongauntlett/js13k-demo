// Ultra-golfed audio system for JS13K
class A {
  constructor() {
    this.c = null;
    this.g = null;
    this.muted = 0;
    this.s = [];
  }

  async i() {
    if (this.c) return;
    this.c = new (AudioContext || webkitAudioContext)();
    this.g = this.c.createGain();
    this.g.gain.value = 0.3;
    this.g.connect(this.c.destination);

    // Create echo bus for spatial effect
    this.delay = this.c.createDelay(0.5);
    this.delay.delayTime.value = 0.15;
    this.feedback = this.c.createGain();
    this.feedback.gain.value = 0.25;
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.delay.connect(this.g);

    // Create all SFX buffers - fast attacks, bell-like releases
    this.s = [
      this.b([1, 800, 0.3, 0.3, 0.002, 0.2]), // 0: collision
      this.b([1, 659, 0.35, 0.4, 0.005, 0.25]), // 1: capture
      this.b([2, 311, 0.25, 0.3, 0.002, 0.15]), // 2: knocked out
      this.b([3, 207, 0.3, 0.35, 0.002, 0.2]), // 3: wrong electron
      this.b([1, 247, 0.2, 0.25, 0.002, 0.12]), // 4: orbital stun
      this.b([1, 1175, 0.12, 0.15, 0.001, 0.08]), // 5: UI hover
      this.b([1, 698, 0.35, 0.4, 0.003, 0.25]), // 6: time warning
      this.b([1, 523, 0.5, 0.5, 0.01, 0.3]), // 7: level complete
      this.b([1, 1318, 0.4, 0.3, 0.002, 0.3]), // 8: twinkle for captures
    ];
  }

  // Create buffer from params [wave,freq,dur,vol,attack,release]
  b(p) {
    const l = this.c.sampleRate * p[2];
    const buf = this.c.createBuffer(1, l, this.c.sampleRate);
    const d = buf.getChannelData(0);
    const a = p[4] * this.c.sampleRate;
    const r = (p[2] - p[5]) * this.c.sampleRate;

    for (let i = 0; i < l; i++) {
      let v;
      if (p[0] == 1)
        v = Math.sin((i * p[1] * 6.28) / this.c.sampleRate); // sine
      else if (p[0] == 2) v = Math.random() * 2 - 1; // noise
      else v = (((i * p[1] * 4) / this.c.sampleRate) % 2) - 1; // sawtooth

      let e = 1;
      if (i < a) e = i / a;
      else if (i > r) e = (l - i) / (l - r);

      d[i] = v * e * p[3];
    }
    return buf;
  }

  // Play SFX by index with optional echo
  p(i, v = 1, echo = false) {
    if (!this.c || this.muted) return;

    // Rate limiting to prevent audio spam
    const now = Date.now();
    this.lastPlay = this.lastPlay || {};
    if (this.lastPlay[i] && now - this.lastPlay[i] < 100) return; // 100ms cooldown per sound
    this.lastPlay[i] = now;

    const s = this.c.createBufferSource();
    const g = this.c.createGain();
    s.buffer = this.s[i];
    g.gain.value = v;
    s.connect(g);
    g.connect(this.g);
    if (echo && this.delay) g.connect(this.delay);
    s.start();

    // Add twinkle for successful captures
    if (i === 1) {
      setTimeout(() => this.p(8, 0.6, true), 100);
    }
  }

  // Start ambient music - gentle musical progression
  m() {
    if (!this.c) return;

    // Chord progression: Am - F - C - G (vi-IV-I-V in C major)
    const chords = [
      [220, 264, 330], // Am (A-C-E)
      [175, 220, 262], // F (F-A-C)
      [196, 247, 294], // C (C-E-G)
      [196, 247, 294], // G (G-B-D) - simplified to fit
    ];

    const melodyNotes = [
      440,
      392,
      349,
      330,
      294,
      330,
      349,
      392, // Gentle descending phrase
      440,
      523,
      494,
      440,
      392,
      349,
      330,
      294, // Rise and fall
    ];

    let chordIndex = 0;
    let melodyIndex = 0;

    // Bass foundation (subtle)
    const bass = this.c.createOscillator();
    const bassGain = this.c.createGain();
    bass.type = "sine";
    bass.frequency.value = 110; // Low A
    bassGain.gain.setValueAtTime(0, this.c.currentTime);
    bassGain.gain.linearRampToValueAtTime(0.006, this.c.currentTime + 4);
    bass.connect(bassGain);
    bassGain.connect(this.g);
    bass.start();

    // Chord pad (3 voices)
    const chordOscs = [];
    for (let i = 0; i < 3; i++) {
      const osc = this.c.createOscillator();
      const gain = this.c.createGain();
      const filter = this.c.createBiquadFilter();

      osc.type = "triangle";
      filter.type = "lowpass";
      filter.frequency.value = 600;
      filter.Q.value = 0.7;

      gain.gain.setValueAtTime(0, this.c.currentTime);
      gain.gain.linearRampToValueAtTime(0.008, this.c.currentTime + 3 + i);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.g);
      osc.start();

      chordOscs.push({ osc, gain });
    }

    // Melody voice
    const melody = this.c.createOscillator();
    const melodyGain = this.c.createGain();
    const melodyFilter = this.c.createBiquadFilter();

    melody.type = "sine";
    melodyFilter.type = "lowpass";
    melodyFilter.frequency.value = 1200;
    melodyGain.gain.setValueAtTime(0, this.c.currentTime);

    melody.connect(melodyFilter);
    melodyFilter.connect(melodyGain);
    melodyGain.connect(this.g);
    if (this.delay) melodyGain.connect(this.delay);
    melody.start();

    // Chord progression (every 8 seconds)
    const changeChord = () => {
      const currentChord = chords[chordIndex];

      // Update bass note
      if (bass.frequency) {
        const bassNote = currentChord[0] / 2; // Octave down
        bass.frequency.exponentialRampToValueAtTime(
          bassNote,
          this.c.currentTime + 1
        );
      }

      // Update chord voices
      chordOscs.forEach((voice, i) => {
        if (voice.osc.frequency) {
          voice.osc.frequency.exponentialRampToValueAtTime(
            currentChord[i],
            this.c.currentTime + 1.5
          );
        }
      });

      chordIndex = (chordIndex + 1) % chords.length;
      setTimeout(changeChord, 8000);
    };

    // Melody notes (every 2-3 seconds)
    const playMelodyNote = () => {
      const note = melodyNotes[melodyIndex];

      if (melody.frequency) {
        // Gentle note entry
        melodyGain.gain.cancelScheduledValues(this.c.currentTime);
        melodyGain.gain.setValueAtTime(0, this.c.currentTime);
        melodyGain.gain.linearRampToValueAtTime(
          0.004,
          this.c.currentTime + 0.3
        );
        melodyGain.gain.linearRampToValueAtTime(0.001, this.c.currentTime + 2);

        melody.frequency.exponentialRampToValueAtTime(
          note,
          this.c.currentTime + 0.1
        );
      }

      melodyIndex = (melodyIndex + 1) % melodyNotes.length;
      setTimeout(playMelodyNote, 2500 + Math.random() * 1000);
    };

    // Start sequences
    setTimeout(changeChord, 4000); // First chord change after 4s
    setTimeout(playMelodyNote, 6000); // First melody note after 6s
  }

  // Mute toggle
  t() {
    this.muted = !this.muted;
    this.g.gain.value = this.muted ? 0 : 0.3;
    return this.muted;
  }
}

// Usage shortcuts
// a.p(0) - collision
// a.p(1) - capture (with auto-twinkle)
// a.p(2) - knocked out
// a.p(3) - wrong electron
// a.p(4) - orbital stun
// a.p(5) - UI hover
// a.p(6) - time warning
// a.p(7) - level complete
// a.p(8) - twinkle (auto-triggered)
