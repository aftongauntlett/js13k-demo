# Atomic Puzzle Game - JS13K Ready! 🚀

[![Build Status](https://img.shields.io/badge/build-ready-success?logo=github-actions)](https://github.com/aftongauntlett/js13k-demo/actions)
[![Size Optimized](https://img.shields.io/badge/size-10.7KB%20zipped-success?logo=javascript)](https://github.com/aftongauntlett/js13k-demo)
[![JS13K Ready](https://img.shields.io/badge/JS13K-2.3KB%20under%20budget-brightgreen?logo=webgl)](https://js13kgames.com/)

> **SUCCESS!** Through massive optimization and "golfing" techniques, this game is now **JS13K compliant** at just **10.7KB zipped** (2.3KB under the 13KB limit). What started as a learning project became a fully optimized JS13K game demonstrating atomic physics education in minimal space.

A physics-based puzzle game demonstrating real atomic structures through interactive orbital mechanics. Build authentic elements from Hydrogen to Nitrogen by guiding electrons into their proper electron shells using electromagnetic fields. Now fully optimized for JS13K competition constraints!

## JS13K Optimization Achievements ⚡

**From 72KB → 10.7KB (85% size reduction!)**

- **Ultra-Golfed Classes**: `AudioSystem` → `A`, `OrbitalSystem` → `O`, `Electron` → `E`
- **Method Compression**: `playSound()` → `p()`, `init()` → `i()`, `mute()` → `t()`
- **Procedural Audio**: Eliminated all audio files, pure Web Audio API synthesis
- **Build Optimization**: Single HTML file with inlined CSS/JS, aggressive compression
- **Dead Code Elimination**: Removed unused utilities, consolidated systems
- **Smart Golfing**: Maintained readability in source, compressed in build

## Features (Fully Optimized) ✨

🎵 **Procedural Audio** - Musical chord progressions and sound effects from code alone  
🧪 **Real Atomic Physics** - Accurate Bohr model with proper electron shell mechanics  
🎮 **Smooth Gameplay** - Electromagnetic attraction/repulsion with advanced collision physics  
⚛️ **Educational Value** - Learn 1s, 2s, 2p orbitals through interactive gameplay  
🎨 **Visual Polish** - Shell outlines, orbital shake effects, particle systems under 11KB!

## How to Play 🎮

- **Blue electrons** are attracted to your mouse (electromagnetic attraction)
- **Orange electrons** are repelled by your mouse (electromagnetic repulsion)
- **Orange orbital timing** - Orange orbitals require precise timing through rotating gaps
- **Capture assistance** - Orange orbitals slow down when mouse is nearby for easier timing
- Guide electrons into orbital rings to fill electron shells
- Electrons automatically capture when they contact a matching orbital (blue: instant, orange: through gaps)
- **Two-hit knockout system** - Hit an occupied orbital twice to knock out the electron
  - First hit: Target shakes visually with sound feedback
  - Second hit: Electron gets knocked out and respawns after delay
- Complete atoms by filling all orbitals with proper electron configuration
- Learn real atomic structure: H (1s¹), He (1s²), Li (1s² 2s¹), C (1s² 2s² 2p²), N (1s² 2s² 2p³)
- **Press 'M' to toggle mute** - Experience procedural ambient music!

## Educational Elements ⚛️

**Level 1: Hydrogen (H)** - Single electron in 1s orbital  
**Level 2: Helium (He)** - Noble gas, complete K shell  
**Level 3: Lithium (Li)** - Alkali metal, reactive due to outer electron  
**Level 4: Carbon (C)** - Basis of organic chemistry, forms 4 bonds  
**Level 5: Nitrogen (N)** - Essential for proteins and DNA

## Technical Architecture 🔧

### Golfed Classes (Source → Build)

- `AudioSystemGolfed.js` → Class `A` (Procedural audio synthesis)
- `OrbitalSystemGolfed.js` → Class `O` (Atomic physics simulation)
- `ElectronGolfed.js` → Class `E` (Particle physics)
- `TutorialGolfed.js` → Class `T` (Educational overlay)
- `GameGolfed.js` → Class `G` (Main game coordination)

### Size Optimization Techniques

- **Variable golfing**: `frequency` → `f`, `amplitude` → `a`
- **Method shortening**: `playSound(index)` → `p(i)`
- **String tables**: Repeated text compressed into arrays
- **CSS elimination**: All styling moved to canvas drawing
- **Build concatenation**: Single HTML file with everything inlined

## Development 💻

```bash
npm run dev    # Development server on :8080
npm run build  # Build optimized game (~10.7KB zipped)
npm run size   # Check current size (alias for build)
```

### Build Output

```
Built file: 36,452 bytes (35.6 KB uncompressed)
Compression: 70.7% reduction
Estimated ZIP size: ~10.7 KB
JS13K budget remaining: ~2.3 KB ✅
```

---

**JS13K Optimization Success** 🏆 - From learning project to competition-ready in one epic refactor!  
Built by [Afton Gauntlett](https://github.com/aftongauntlett) - Ready for JS13K 2025! ⚛️
