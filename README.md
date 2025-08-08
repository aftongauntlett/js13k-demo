# Quantum Chaos - js13k Game

[![js13k Competition](https://img.shields.io/badge/js13k-2025-orange?logo=javascript)](https://js13kgames.com/)
[![Build Status](https://img.shields.io/badge/build-ready-success?logo=github-actions)](https://github.com/aftongauntlett/js13k-demo/actions)
[![Game Size](https://img.shields.io/badge/size-%3C13KB-brightgreen?logo=webpack)](https://github.com/aftongauntlett/js13k-demo)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/aftongauntlett/js13k-demo?logo=git)](https://github.com/aftongauntlett/js13k-demo/commits)
[![Live Demo](https://img.shields.io/badge/play-online-blue?logo=web)](https://aftongauntlett.github.io/js13k-demo)

A physics-based puzzle game demonstrating chaos theory principles through atomic orbital mechanics. Guide electrons using electromagnetic fields to achieve stable atomic configurations. This is a practice game to learn and prepare for the js13k competition - a coding competition for web game developers with a strict 13KB size limit.

## Project Goals

This project serves as a **learning experience**:

- Master extreme size optimization techniques for web games
- Explore procedural graphics and physics simulation
- Practice Canvas API and scientific visualization
- Learn competition submission processes and requirements
- Create an educational physics game within severe constraints

## Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Canvas API](https://img.shields.io/badge/Canvas_API-FF6B6B?style=flat&logo=html5&logoColor=white)
![Physics](https://img.shields.io/badge/Physics_Engine-4285F4?style=flat&logo=atom&logoColor=white)
![Terser](https://img.shields.io/badge/Terser-000000?style=flat&logo=terser&logoColor=white)

- **Vanilla JavaScript** - No frameworks, maximum size control
- **Canvas API** - Hardware accelerated 2D physics visualization
- **Quantum Physics Simulation** - Real atomic orbital mechanics
- **Terser** - JavaScript minification and compression
- **HTMLMinifier** - Final build optimization
- **Roadroller** - Extreme compression for js13k submissions

## Project Structure

```
js13k-demo/
├── README.md              # Project documentation
├── src/                   # Source files (modular development)
│   ├── index.html        # Main HTML template
│   ├── Game.js           # Main game class and quantum physics logic
│   ├── components/       # Game components
│   │   └── Electron.js   # Electron particles with quantum field effects
│   └── systems/          # Game systems
│       ├── Renderer.js   # Quantum field background and visual effects
│       ├── OrbitalSystem.js # Atomic orbital configuration management
│       └── InputSystem.js # Electromagnetic field input handling
├── build/                # Build tools and scripts
│   └── build.js          # Combines files into single HTML
├── dist/                 # Final game output
│   └── index.html        # Minified single-file game
└── package.json          # Build scripts and dependencies
```

## Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/aftongauntlett/js13k-demo.git
cd js13k-demo

# Start modular development server
npm run dev
# → Access at http://localhost:8080

# Build single file for production
npm run build
# → Creates dist/index.html

# Check final size
npm run size
```

### Development Commands

```bash
# Watch mode with live reload
npm run watch

# Run size analysis
npm run analyze

# Validate game requirements
npm run validate

# Clean build artifacts
npm run clean
```

## Game Features

### Physics Simulation

- **Quantum field visualization** - Dynamic background with field fluctuations
- **Electromagnetic interactions** - Mouse cursor creates electromagnetic fields
- **Electron orbital mechanics** - Realistic atomic physics behavior
- **Quantum tunneling effects** - Electrons can probabilistically jump between states
- **Energy state transitions** - Electrons can be excited to higher energy levels

### Chaos Theory Mechanics

- **Butterfly effect** - Small mouse movements create large system changes
- **Emergent behavior** - Complex patterns arise from simple electron interactions
- **Sensitive dependence** - Initial conditions dramatically affect outcomes
- **Nonlinear dynamics** - System evolution follows chaos theory principles

### Educational Elements

- **Atomic structures** - Progress through real element configurations (H, He, Li, C, Ne)
- **Orbital shell theory** - Learn about electron shells and energy levels
- **Scientific accuracy** - Based on actual quantum mechanics principles
- **Interactive physics** - Hands-on exploration of electromagnetic forces

### Gameplay Mechanics

- **Electromagnetic manipulation** - Use mouse cursor as electromagnetic field source
- **Orbital configuration puzzles** - Guide electrons to stable atomic arrangements
- **Progressive complexity** - Advance from simple hydrogen to complex neon configurations
- **Scientific discovery** - Learn through experimentation and observation
- **Real-time physics** - Immediate feedback from electromagnetic field changes

## Size Optimization

### Current Status

- **Target Size**: ≤ 13,312 bytes (zipped)
- **Current Size**: ~10.5 KB (uncompressed single file)
- **Optimization Level**: Modular development with build system
- **Progress**: Quantum physics simulation with electromagnetic field interactions ⚛️

### Techniques Used

- **Code minification** - Variable shortening and dead code removal
- **Procedural assets** - No external images, all graphics generated mathematically
- **Physics calculations** - Algorithmic particle simulation and field visualization
- **Inline everything** - Single HTML file approach
- **Compression tools** - Roadroller and advanced ZIP optimization

## Competition Requirements

- ✅ **Size Limit**: Game must be ≤ 13KB when zipped
- ✅ **Standalone**: Works offline, no external dependencies
- ✅ **Browser Compatible**: Runs in modern web browsers
- ✅ **index.html**: Game loads from root HTML file
- ✅ **Source Available**: Full readable source in this repository

## License

MIT License - Feel free to explore, learn from, and adapt the code for educational purposes.

---

Built with ⚛️ by [Afton Gauntlett](https://github.com/aftongauntlett) • Quantum Physics Game Developer practicing for js13k Competition 2025
