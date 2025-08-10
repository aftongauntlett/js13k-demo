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

  // Generate ethereal, celestial ambient background music (Celeste-inspired)
  startBackgroundMusic() {
    if (!this.isInitialized || this.backgroundMusic) return;

    const musicGain = this.audioContext.createGain();
    musicGain.connect(this.masterGain);
    musicGain.gain.value = this.musicVolume;

    // Ethereal celestial chord progression - dreamy, floating feeling
    // Using extended chords with 7ths and 9ths for that spacey, atmospheric sound
    const celestialChords = [
      [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9 - floating, open
      [146.83, 184.997, 220.0, 277.18, 329.63], // Dmaj9 - lifted, bright
      [164.81, 207.65, 246.94, 311.13, 369.99], // Emaj7 - warm, enveloping
      [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9 - grounded yet ethereal
    ];

    // Create ethereal pad layer with slow-moving chords
    this.createEtherealPads(celestialChords, musicGain);

    // Create twinkling star-like arpeggios
    this.createTwinklingLayer(musicGain);

    // Create ambient echo/reverb layer
    this.createAmbientEchoLayer(musicGain);

    this.backgroundMusic = { musicGain, chords: celestialChords };

    console.log("Ethereal celestial background music started");
  }

  // Ethereal pad layer - slowly morphing chords
  createEtherealPads(chords, musicGain) {
    let currentChord = 0;
    let nextChordTime = this.audioContext.currentTime;

    const playEtherealChord = (frequencies, startTime, duration) => {
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Soft sawtooth waves for rich harmonics, filtered heavily
        osc.type = "sawtooth";
        osc.frequency.value = freq * 0.25; // Two octaves down for deep pad sound

        // Heavy low-pass filtering for ethereal softness
        filter.type = "lowpass";
        filter.frequency.value = 400 + Math.sin(startTime * 0.2) * 100; // Slow filter sweep
        filter.Q.value = 0.5;

        // Very slow, breathing envelope
        oscGain.gain.setValueAtTime(0, startTime);
        oscGain.gain.linearRampToValueAtTime(0.08, startTime + 4); // 4 second fade in
        oscGain.gain.setValueAtTime(0.08, startTime + duration - 4);
        oscGain.gain.linearRampToValueAtTime(0, startTime + duration); // 4 second fade out

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(musicGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    };

    const scheduleNextChord = () => {
      const chordDuration = 12; // 12 seconds per chord for maximum ethereal effect
      playEtherealChord(chords[currentChord], nextChordTime, chordDuration);

      currentChord = (currentChord + 1) % chords.length;
      nextChordTime += chordDuration;

      setTimeout(() => scheduleNextChord(), (chordDuration - 2) * 1000);
    };

    scheduleNextChord();
  }

  // Twinkling star-like arpeggios
  createTwinklingLayer(musicGain) {
    const twinkleGain = this.audioContext.createGain();
    twinkleGain.connect(musicGain);
    twinkleGain.gain.value = 0.3;

    // High frequencies for twinkling effect
    const twinkleNotes = [
      523.25,
      587.33,
      659.25,
      698.46,
      783.99,
      880.0,
      987.77,
      1046.5, // C5-C6
      1174.66,
      1318.51,
      1396.91,
      1567.98, // Higher octave sparkles
    ];

    const createTwinkle = () => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // Sine waves for pure, bell-like tones
      osc.type = "sine";
      osc.frequency.value =
        twinkleNotes[Math.floor(Math.random() * twinkleNotes.length)];

      // High-pass filter for sparkly effect
      filter.type = "highpass";
      filter.frequency.value = 800;
      filter.Q.value = 1;

      // Quick sparkle envelope
      const now = this.audioContext.currentTime;
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 2 + Math.random() * 3
      );

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(twinkleGain);

      osc.start(now);
      osc.stop(now + 5);

      // Schedule next twinkle randomly
      setTimeout(() => createTwinkle(), 1000 + Math.random() * 4000);
    };

    // Start twinkling
    createTwinkle();
  }

  // Ambient echo/reverb layer for spacey atmosphere
  createAmbientEchoLayer(musicGain) {
    const ambientGain = this.audioContext.createGain();
    ambientGain.connect(musicGain);
    ambientGain.gain.value = 0.2;

    const createAmbientTone = () => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();
      const filter1 = this.audioContext.createBiquadFilter();
      const filter2 = this.audioContext.createBiquadFilter();

      // Very low frequency drone with filtered noise-like texture
      osc.type = "triangle";
      osc.frequency.value = 65.41 + Math.random() * 32; // Around C2, slightly detuned

      // Double filtering for extra ethereal quality
      filter1.type = "lowpass";
      filter1.frequency.value = 200;
      filter1.Q.value = 2;

      filter2.type = "highpass";
      filter2.frequency.value = 80;
      filter2.Q.value = 0.5;

      // Very long, slow envelope
      const now = this.audioContext.currentTime;
      const duration = 20 + Math.random() * 15; // 20-35 second drones

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.05, now + 8); // 8 second fade in
      oscGain.gain.setValueAtTime(0.05, now + duration - 8);
      oscGain.gain.linearRampToValueAtTime(0, now + duration); // 8 second fade out

      osc.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(oscGain);
      oscGain.connect(ambientGain);

      osc.start(now);
      osc.stop(now + duration);

      // Schedule next ambient tone
      setTimeout(() => createAmbientTone(), (duration - 10) * 1000);
    };

    // Start ambient layer
    createAmbientTone();
  }

  // Ethereal electron capture sound - crystalline bells with echo
  playElectronCapture() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.6;

    // Ethereal crystal-like chime cascade - multiple octaves for richness
    const frequencies = [
      523.25,
      659.25,
      783.99, // C major triad
      1046.5,
      1318.51,
      1567.98, // Same triad one octave higher for sparkle
    ];

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // Sine waves for pure, bell-like tones
      osc.type = "sine";
      osc.frequency.value = freq;

      // High-Q filter for crystalline resonance
      filter.type = "bandpass";
      filter.frequency.value = freq * 1.2;
      filter.Q.value = 8; // High Q for bell-like resonance

      const startTime = this.audioContext.currentTime + index * 0.03; // Slight cascade timing

      // Bell-like envelope with longer decay
      oscGain.gain.setValueAtTime(0, startTime);
      oscGain.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(
        0.001,
        startTime + 1.5 + Math.random() * 0.5
      );

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(gain);

      osc.start(startTime);
      osc.stop(startTime + 2);
    });
  }

  // Ethereal wrong electron feedback - gentle, floating dissonance
  playWrongElectron() {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);

    // Gentle, floating dissonance that drifts away rather than harsh rejection
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const filter1 = this.audioContext.createBiquadFilter();
    const filter2 = this.audioContext.createBiquadFilter();

    // Sine waves for ethereal quality
    osc1.type = "sine";
    osc2.type = "sine";

    // Start with a gentle interval, then drift apart
    osc1.frequency.setValueAtTime(440, this.audioContext.currentTime); // A
    osc1.frequency.exponentialRampToValueAtTime(
      392,
      this.audioContext.currentTime + 1.2
    ); // drift to G

    osc2.frequency.setValueAtTime(466.16, this.audioContext.currentTime); // A# (slight dissonance)
    osc2.frequency.exponentialRampToValueAtTime(
      349.23,
      this.audioContext.currentTime + 1.2
    ); // drift to F

    // Heavy filtering for dreaminess
    filter1.type = "lowpass";
    filter1.frequency.value = 800;
    filter1.Q.value = 2;

    filter2.type = "lowpass";
    filter2.frequency.value = 600;
    filter2.Q.value = 2;

    const osc1Gain = this.audioContext.createGain();
    const osc2Gain = this.audioContext.createGain();

    osc1Gain.gain.value = 0.12;
    osc2Gain.gain.value = 0.12;

    osc1.connect(filter1);
    filter1.connect(osc1Gain);
    osc2.connect(filter2);
    filter2.connect(osc2Gain);
    osc1Gain.connect(gain);
    osc2Gain.connect(gain);

    // Floating, dreamy envelope
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      this.sfxVolume * 0.2,
      this.audioContext.currentTime + 0.2
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 1.5
    );

    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 1.5);
    osc2.stop(this.audioContext.currentTime + 1.5);
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

  // Ethereal orbital gliding - like floating through space
  playOrbitalGlide(velocity = 1.0) {
    if (!this.isInitialized) return;

    const gain = this.audioContext.createGain();
    gain.connect(this.masterGain);
    gain.gain.value = this.sfxVolume * 0.08 * Math.min(velocity, 1.0); // Very subtle, velocity-based

    // Create ethereal floating sound with multiple harmonics
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const filter1 = this.audioContext.createBiquadFilter();
    const filter2 = this.audioContext.createBiquadFilter();

    // Sine waves for pure, ethereal quality
    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.value = 220 + velocity * 60; // Base frequency
    osc2.frequency.value = (220 + velocity * 60) * 1.5; // Perfect fifth for harmony

    // Heavy filtering for dreaminess
    filter1.type = "lowpass";
    filter1.frequency.value = 400 + velocity * 200;
    filter1.Q.value = 3;

    filter2.type = "bandpass";
    filter2.frequency.value = 600 + velocity * 300;
    filter2.Q.value = 5;

    // Breathing envelope
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gain.gain.value, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.3 + Math.random() * 0.2
    );

    osc1.connect(filter1);
    osc2.connect(filter2);
    filter1.connect(gain);
    filter2.connect(gain);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
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
