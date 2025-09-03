# Orbital Order (Aufbau) - JS13K Practice

[![Commit Activity](https://img.shields.io/github/commit-activity/m/aftongauntlett/js13k-demo?logo=git)](https://github.com/aftongauntlett/js13k-demo/commits)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)](https://js13k-demo.vercel.app)
[![JS13K Ready](https://img.shields.io/badge/JS13K-At%20Budget%20Limit-yellow?logo=webgl)](https://js13kgames.com/)

A physics-based puzzle game demonstrating real atomic structures through interactive orbital mechanics. Build authentic elements from Hydrogen to Nitrogen by guiding electrons into their proper electron shells using electromagnetic fields. Now fully optimized for JS13K competition constraints!

## Features

**Procedural Audio** - Musical chord progressions and sound effects from code alone  
**Real Atomic Physics** - Accurate electron configuration following Aufbau principle  
**Intuitive Controls** - Mouse-based electromagnetic field simulation  
**Educational Value** - Learn 1s, 2s, 2p-orbitals and quantum mechanical rules  
**Visual Feedback** - Orbital labels, rule violations, particle systems under 13KB!

## How to Play

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

## Educational Elements

**Level 1: Hydrogen (H)** - Single electron in 1s orbital  
**Level 2: Helium (He)** - Noble gas, complete K shell  
**Level 3: Lithium (Li)** - Alkali metal, reactive due to outer electron  
**Level 4: Carbon (C)** - Basis of organic chemistry, forms 4 bonds  
**Level 5: Nitrogen (N)** - Essential for proteins and DNA

## Technical Architecture

### Golfed Classes (Source → Build)

- `AudioSystemGolfed.js` → Class `A` (Procedural audio synthesis)
- `OrbitalSystemGolfed.js` → Class `O` (Atomic physics simulation)
- `ElectronGolfed.js` → Class `E` (Particle physics)
- `TutorialGolfed.js` → Class `T` (Educational overlay)
- `GameGolfed.js` → Class `G` (Main game coordination)

## Development 💻

```bash
npm run dev    # Development server on :8080
npm run build  # Build optimized game (~13.0KB zipped)
npm run size   # Check current size (alias for build)
```

### Build Output

```
Built file: 44367 bytes (43.3 KB)
Compression: 0.4% reduction
Estimated ZIP size: ~13.0 KB
JS13K budget remaining: ~0.0 KB ⚠️
```

---

Built with ✨ by [Afton Gauntlett](https://github.com/aftongauntlett) • Senior Frontend Engineer
