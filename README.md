# ⚛️ Orbital Order (Aufbau)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![js13k](https://img.shields.io/badge/js13k-practice-orange.svg)](https://js13kgames.com/)
[![Size](https://img.shields.io/badge/size-8.2KB-brightgreen.svg)](#)

> _Build authentic elements from Hydrogen to Oxygen by guiding electrons into proper orbital shells using electromagnetic fields in this physics-based educational puzzle_

**[Play the game →](https://orbital-order.aftongauntlett.com/)**

## About

A physics-based puzzle game demonstrating real atomic structures through interactive orbital mechanics. Master electron configuration rules to build elements while learning authentic quantum mechanics. Fully optimized for JS13K competition at ~8.2KB zipped!

**Core Loop**: Attract s-electrons → Repel p-electrons → Follow Aufbau principle → Build atoms

## Quick Start

### Controls

- **Mouse Movement**: Creates electromagnetic field
- **Blue s-electrons**: Attracted to cursor
- **Orange p-electrons**: Repelled by cursor
- **ESC**: Toggle tutorial
- **M**: Toggle audio

### Win Condition

Complete all 6 elements (H → He → Li → C → N → O) following electron configuration rules.

## Key Features

### Real Atomic Physics

Accurate electron configuration following the Aufbau principle: 1s² → 2s² → 2p⁶

### Quantum Rules System

- Orbitals glow red when they cannot accept electrons
- Fill lower energy orbitals first
- Wrong color electrons bounce off orbitals

### Two-Hit Knockout Penalty

Hitting an occupied orbital twice ejects the electron as a penalty:

- **First collision**: Orbital shakes with audio feedback
- **Second collision**: Electron ejected, orbital temporarily inactive (grayed out)

### Educational Elements

**Level 1: Hydrogen (H)** - Simplest atom, makes up 75% of universe  
**Level 2: Helium (He)** - Noble gas, never reacts, used in balloons  
**Level 3: Lithium (Li)** - Lightest metal, used in phone batteries  
**Level 4: Carbon (C)** - Forms 4 bonds, base of all life on Earth  
**Level 5: Nitrogen (N)** - Essential for DNA, makes up 78% of air  
**Level 6: Oxygen (O)** - Supports combustion, 21% of Earth's atmosphere

## Technical Details

- **Engine**: Vanilla JavaScript + Canvas 2D
- **Features**: Particle systems, procedural audio, dynamic physics simulation
- **Performance**: 60fps with real-time electron interactions
- **Size**: ~8.2KB zipped (JS13K practice)
- **Architecture**: Class-based with code golf optimization (Classes A, O, E, T, G)

## Development

```bash
npm install  # Install dependencies
npm run dev  # Development server on :8080
npm run build # Production build (~8.2KB zipped)
```

## Post-Mortem

**My first completed game!** This JS13K practice project taught me:

- **Canvas 2D mastery** - Advanced particle systems, gradients, and visual effects without WebGL
- **Code golf techniques** - Terser optimization achieving 47% compression ratio
- **Procedural audio success** - Web Audio API generated all music and sound effects from code
- **Educational game design** - Balancing scientific accuracy with engaging gameplay
- **Community feedback value** - Playtesting revealed UX improvements that shaped my main JS13K entry

**Key challenges:** Learning build tools (Terser, minification), working within single-file constraints, and translating quantum mechanics into intuitive mouse controls.

**[Read the full post-mortem](https://www.aftongauntlett.com/blog/orbital-order-post-mortem)** for technical deep-dive, lessons learned, and AI tool usage insights.

---

MIT License - Built with ✨ by [Afton Gauntlett](https://github.com/aftongauntlett)
