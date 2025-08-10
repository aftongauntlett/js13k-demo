// Futuristic electronic audio system using Web Audio API
class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.backgroundMusic = null;
    this.isInitialized = false;
    this.isMuted = false;

    // Audio settings
    this.volume = 0.4;
    this.musicVolume = 0.7; // Increased significantly to make music more audible
    this.sfxVolume = 0.4;
  }

  // Initialize audio context (must be called after user interaction)
  async init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.volume;

      this.isInitialized = true;
      console.log("Audio system initialized");

      // Start ambient background music
      this.startBackgroundMusic();
    } catch (error) {
      console.warn("Audio initialization failed:", error);
    }
  }

  // Generate ultra-chill ambient background music
  startBackgroundMusic() {
    if (!this.isInitialized || this.backgroundMusic) return;

    const musicGain = this.audioContext.createGain();
    musicGain.connect(this.masterGain);
    musicGain.gain.value = this.musicVolume;

    // Simple, peaceful chord progression - all major/consonant chords
    // Using C - F - Am - G progression (very stable and calming)
    const chordProgression = [
      [130.81, 164.81, 196.0], // C major (C-E-G) - peaceful home
      [174.61, 220.0, 261.63], // F major (F-A-C) - warm and stable
      [220.0, 261.63, 329.63], // A minor (A-C-E) - gentle and soft
      [196.0, 246.94, 293.66], // G major (G-B-D) - uplifting resolution
    ];

    const oscillators = [];
    let currentChord = 0;
    let nextChordTime = this.audioContext.currentTime;

    // Function to play very soft, warm chords
    const playChord = (frequencies, startTime, duration) => {
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Pure sine waves for maximum smoothness
        osc.type = "sine";
        osc.frequency.value = freq * 0.5; // Low octave for warmth

        // Very gentle low-pass filter to remove any harsh frequencies
        filter.type = "lowpass";
        filter.frequency.value = 800; // Increased from 400 to let more harmonics through
        filter.Q.value = 0.1; // Very gentle filtering

        // Extremely gentle fade in/out - no sudden changes
        oscGain.gain.setValueAtTime(0, startTime);
        oscGain.gain.linearRampToValueAtTime(0.15, startTime + 2); // Increased from 0.08 to be more audible
        oscGain.gain.setValueAtTime(0.15, startTime + duration - 2);
        oscGain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(musicGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    };

    // Schedule chord progression with longer, more relaxed timing
    const scheduleNextChord = () => {
      const chordDuration = 8; // 8 seconds per chord for maximum calm
      playChord(chordProgression[currentChord], nextChordTime, chordDuration);

      console.log(`Playing chord ${currentChord + 1} at time ${nextChordTime}`);

      currentChord = (currentChord + 1) % chordProgression.length;
      nextChordTime += chordDuration;

      // Schedule next chord
      setTimeout(() => scheduleNextChord(), (chordDuration - 1.5) * 1000);
    }; // Remove the high ambient layer that might be grating
    // Just keep one very subtle bass pad
    const bassPad = this.audioContext.createOscillator();
    const bassPadGain = this.audioContext.createGain();
    const bassPadFilter = this.audioContext.createBiquadFilter();

    bassPad.type = "triangle";
    bassPad.frequency.value = 65.41; // Low C

    bassPadFilter.type = "lowpass";
    bassPadFilter.frequency.value = 200; // Very low
    bassPadFilter.Q.value = 0.1;

    bassPadGain.gain.value = 0.01; // Increased from 0.002 to be more audible

    bassPad.connect(bassPadFilter);
    bassPadFilter.connect(bassPadGain);
    bassPadGain.connect(musicGain);

    bassPad.start();
    oscillators.push(bassPad);

    // Very subtle, slow LFO for gentle movement
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.03; // Extremely slow
    lfoGain.gain.value = 15; // Very gentle modulation

    lfo.connect(lfoGain);
    lfoGain.connect(bassPadFilter.frequency);
    lfo.start();

    // Start the chord progression
    scheduleNextChord();

    this.backgroundMusic = { oscillators, lfo, musicGain };
    console.log("Ultra-chill ambient background music started");
  }

  // Electron capture sound - soft, crystalline
  playElectronCapture() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.5;

    // Soft crystal-like chime using multiple harmonics
    const frequencies = [523.25, 659.25, 783.99]; // C major triad high octave

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.value = freq;

      filter.type = "lowpass";
      filter.frequency.value = 3000;
      filter.Q.value = 2;

      const startTime = this.audioContext.currentTime + index * 0.05;

      oscGain.gain.setValueAtTime(0, startTime);
      oscGain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(gain);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // Wrong electron type collision - soft negative feedback
  playWrongElectron() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);

    // Soft dissonant chord that resolves downward
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(349.23, this.audioContext.currentTime); // F
    osc1.frequency.exponentialRampToValueAtTime(
      261.63,
      this.audioContext.currentTime + 0.3
    ); // to C

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(369.99, this.audioContext.currentTime); // F#
    osc2.frequency.exponentialRampToValueAtTime(
      246.94,
      this.audioContext.currentTime + 0.3
    ); // to B

    const osc1Gain = this.audioContext.createGain();
    const osc2Gain = this.audioContext.createGain();

    osc1Gain.gain.value = 0.15;
    osc2Gain.gain.value = 0.15;

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc1Gain.connect(gain);
    osc2Gain.connect(gain);

    // Soft envelope
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      this.sfxVolume * 0.3,
      this.audioContext.currentTime + 0.05
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.35
    );

    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.35);
    osc2.stop(this.audioContext.currentTime + 0.35);
  }

  // Level completion - celebratory but calm
  playLevelComplete() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.8;

    // Ascending arpeggio
    const frequencies = [440, 554.37, 659.25, 880]; // A major chord progression

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const noteGain = this.audioContext.createGain();
      noteGain.connect(gain);

      const startTime = this.audioContext.currentTime + index * 0.1;
      const duration = 0.4;

      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(noteGain);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Electron knocked out - gentle thud
  playElectronKnockedOut() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);

    // Low frequency thud with some harmonics
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();

    osc1.type = "sine";
    osc1.frequency.value = 120;

    osc2.type = "triangle";
    osc2.frequency.value = 60;

    const osc1Gain = this.audioContext.createGain();
    const osc2Gain = this.audioContext.createGain();

    osc1Gain.gain.value = 0.4;
    osc2Gain.gain.value = 0.6;

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc1Gain.connect(gain);
    osc2Gain.connect(gain);

    // Quick thud envelope
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      this.sfxVolume * 0.5,
      this.audioContext.currentTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.15
    );

    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.15);
    osc2.stop(this.audioContext.currentTime + 0.15);
  }

  // Orbital stun effect - electronic glitch
  playOrbitalStun() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.3;

    // Create a brief electronic glitch sound
    const noise = this.audioContext.createBufferSource();
    const buffer = this.audioContext.createBuffer(1, 4410, 44100); // 0.1 seconds
    const data = buffer.getChannelData(0);

    // Generate filtered noise
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 1000);
    }

    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 5;

    noise.connect(filter);
    filter.connect(gain);

    noise.start();
  }

  // Hover/UI feedback - subtle beep
  playUIHover() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);

    const osc = this.audioContext.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 800;

    // Very brief and quiet
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      this.sfxVolume * 0.2,
      this.audioContext.currentTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.05
    );

    osc.connect(gain);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  // Orbital collision - when hitting occupied orbital without knocking out
  playOrbitalCollision() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);

    // Similar to wrong electron but shorter and less dissonant
    const osc = this.audioContext.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(330, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      280,
      this.audioContext.currentTime + 0.1
    );

    // Quick bounce sound
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      this.sfxVolume * 0.3,
      this.audioContext.currentTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.12
    );

    osc.connect(gain);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.12);
  }

  // Game over sound - when timer runs out
  playGameOver() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.6;

    // Descending minor chord - melancholy but not harsh
    const frequencies = [523.25, 415.3, 349.23, 261.63]; // C - Ab - F - C (minor)

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;

      const noteGain = this.audioContext.createGain();
      noteGain.connect(gain);

      const startTime = this.audioContext.currentTime + index * 0.15;
      const duration = 0.6;

      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.25, startTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(noteGain);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Subtle orbital gliding sound for when electrons are moving
  playOrbitalGlide(velocity = 1.0) {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.1 * Math.min(velocity, 1.0); // Very subtle, velocity-based

    // Create a soft whoosh using filtered noise
    const osc = this.audioContext.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 80 + velocity * 40; // Low frequency that varies with speed

    const filter = this.audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 200 + velocity * 100;
    filter.Q.value = 2;

    // Very brief, subtle sound
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      gain.gain.value,
      this.audioContext.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.15
    );

    osc.connect(filter);
    filter.connect(gain);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  // Time running out warning sound
  playTimeWarning() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.4;

    // Urgent but not harsh warning tone
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();

    osc1.type = "triangle";
    osc2.type = "triangle";
    osc1.frequency.value = 440; // A4
    osc2.frequency.value = 554; // C#5 - creates tension

    // Pulsing envelope for urgency
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      0.3,
      this.audioContext.currentTime + 0.05
    );
    gain.gain.linearRampToValueAtTime(
      0.1,
      this.audioContext.currentTime + 0.15
    );
    gain.gain.linearRampToValueAtTime(
      0.3,
      this.audioContext.currentTime + 0.25
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.5
    );

    osc1.connect(gain);
    osc2.connect(gain);

    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.5);
    osc2.stop(this.audioContext.currentTime + 0.5);
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  // Cleanup
  destroy() {
    if (this.backgroundMusic) {
      // Stop all oscillators (both chord and ambient layers)
      this.backgroundMusic.oscillators.forEach((osc) => {
        if (osc && osc.stop) {
          try {
            osc.stop();
          } catch (e) {
            // Oscillator may already be stopped
          }
        }
      });

      if (this.backgroundMusic.lfo) {
        try {
          this.backgroundMusic.lfo.stop();
        } catch (e) {
          // LFO may already be stopped
        }
      }

      this.backgroundMusic = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
  }
}
