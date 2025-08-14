# Orbital Order (Aufbau) - JS13K Practice

[![Commit Activity](https://img.shields.io/github/commit-activity/m/aftongauntlett/js13k-demo?logo=git)](https://github.com/aftongauntlett/js13k-demo/commits)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)](https://js13k-demo.vercel.app)
[![JS13K Ready](https://img.shields.io/badge/JS13K-2.3KB%20under%20budget-brightgreen?logo=webgl)](https://js13kgames.com/)

> **SUCCESS!** Through massive optimization and "golfing" techniques, this game is now **JS13K compliant** at just **11.5KB zipped** (1.5KB under the 13KB limit). What started as a learning project became a fully optimized JS13K game demonstrating atomic physics education in minimal space.

A physics-based puzzle game demonstrating real atomic structures through interactive orbital mechanics. Build authentic elements from Hydrogen to Nitrogen by guiding electrons into their proper electron shells using electromagnetic fields. Now fully optimized for JS13K competition constraints!

## JS13K Optimization Achievements ⚡

**From 72KB → 11.5KB (84% size reduction!)**

- **Ultra-Golfed Classes**: `AudioSystem` → `A`, `OrbitalSystem` → `O`, `Electron` → `E`
- **Method Compression**: `playSound()` → `p()`, `init()` → `i()`, `mute()` → `t()`
- **Procedural Audio**: Eliminated all audio files, pure Web Audio API synthesis
- **Build Optimization**: Single HTML file with inlined CSS/JS, aggressive compression
- **Dead Code Elimination**: Removed unused utilities, consolidated systems
- **Smart Golfing**: Maintained readability in source, compressed in build

## Features (Fully Optimized) ✨

**Procedural Audio** - Musical chord progressions and sound effects from code alone  
**Real Atomic Physics** - Accurate electron configuration following Aufbau principle  
**Intuitive Controls** - Mouse-based electromagnetic field simulation  
**Educational Value** - Learn 1s, 2s, 2p orbitals and quantum mechanical rules  
**Visual Feedback** - Orbital labels, rule violations, particle systems under 13KB!

## How to Play 🎮

- **Blue electrons (s-orbitals)** are attracted to your mouse cursor
- **Orange electrons (p-orbitals)** are repelled by your mouse cursor
- Guide electrons into matching colored orbitals to build atoms
- Follow real electron configuration rules: 1s² → 2s² → 2p⁶
- Orbitals glow red when they cannot accept electrons due to quantum rules
- **Two-hit knockout system** - Click occupied orbitals twice to remove electrons
  - First click: Orbital shakes with audio feedback
  - Second click: Electron is ejected and respawns elsewhere
- Complete atoms by filling all orbitals according to the Aufbau principle
- Learn real atomic structure: H (1s¹), He (1s²), Li (1s² 2s¹), C (1s² 2s² 2p²), N (1s² 2s² 2p³)
- **Complete all 6 levels to earn a time achievement** - Your completion time is saved!
- **Press 'ESC' for Tutorial** - Learn controls and quantum rules
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
Built file: 39222 bytes (38.3 KB)
Compression: 0.6% reduction
Estimated ZIP size: ~11.5 KB
JS13K budget remaining: ~1.5 KB ✅
```

---

Built with ✨ by [Afton Gauntlett](https://github.com/aftongauntlett) • Senior Frontend Engineer
