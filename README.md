# Mystic Grove - js13k Game

[![js13k Competition](https://img.shields.io/badge/js13k-2025-orange?logo=javascript)](https://js13kgames.com/)
[![Build Status](https://img.shields.io/badge/build-ready-success?logo=github-actions)](https://github.com/aftongauntlett/js13k-demo/actions)
[![Game Size](https://img.shields.io/badge/size-%3C13KB-brightgreen?logo=webpack)](https://github.com/aftongauntlett/js13k-demo)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/aftongauntlett/js13k-demo?logo=git)](https://github.com/aftongauntlett/js13k-demo/commits)
[![Live Demo](https://img.shields.io/badge/play-online-blue?logo=web)](https://aftongauntlett.github.io/js13k-demo)

A zen-like puzzle/exploration game featuring glowing fireflies, magical forest atmosphere, and smooth physics interactions. This is a practice game to learn and prepare for the js13k competition - a coding competition for web game developers with a strict 13KB size limit.

## Project Goals

This project serves as a **learning experience**:

- Master extreme size optimization techniques for web games
- Explore procedural graphics and audio generation
- Practice Canvas API and Web Audio for game development
- Learn competition submission processes and requirements
- Create a visually stunning game within severe constraints

## Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Canvas API](https://img.shields.io/badge/Canvas_API-FF6B6B?style=flat&logo=html5&logoColor=white)
![Web Audio](https://img.shields.io/badge/Web_Audio-4285F4?style=flat&logo=webaudio&logoColor=white)
![Terser](https://img.shields.io/badge/Terser-000000?style=flat&logo=terser&logoColor=white)

- **Vanilla JavaScript** - No frameworks, maximum size control
- **Canvas API** - Hardware accelerated 2D graphics and particle systems
- **Web Audio API** - Procedural sound generation and ambient audio
- **Terser** - JavaScript minification and compression
- **HTMLMinifier** - Final build optimization
- **Roadroller** - Extreme compression for js13k submissions

## Project Structure

```
js13k-demo/
├── README.md              # Project documentation
├── DEVLOG.md             # Development log and commit history
├── src/                  # Source files (development)
│   ├── index.html        # Main HTML template
│   ├── game.js           # Core game logic
│   ├── physics.js        # Particle physics system
│   ├── renderer.js       # Canvas rendering engine
│   └── audio.js          # Procedural audio system
├── build/                # Build tools and scripts
│   ├── minify.js         # Minification script
│   ├── package.json      # Build dependencies
│   └── compress.js       # Final compression
└── dist/                 # Final game output
    ├── index.html        # Minified single-file game
    └── game.zip          # Competition submission
```

## Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/aftongauntlett/js13k-demo.git
cd js13k-demo

# Install build dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Check final size
npm run size

# Create competition zip
npm run package
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

### Visual Effects

- **Atmospheric gradients** - Deep teals to purples background
- **Glowing particles** - Firefly-like orbs with soft light emission
- **Physics interactions** - Mouse-responsive particle movement
- **Lightning connections** - Energy links between collected elements
- **Smooth animations** - 60fps particle systems and transitions

### Audio Design

- **Procedural ambiance** - Generated forest sounds and atmosphere
- **Interactive feedback** - Synthesized tones for player actions
- **Dynamic music** - Algorithmic composition adapting to gameplay

### Gameplay Mechanics

- **Zen exploration** - Relaxing, non-stressful gameplay
- **Pattern collection** - Guide fireflies to form constellations
- **Physics puzzles** - Use mouse interaction to solve challenges
- **Progressive difficulty** - Increasingly complex magical patterns

## Size Optimization

### Current Status

- **Target Size**: ≤ 13,312 bytes (zipped)
- **Current Size**: TBD
- **Optimization Level**: Development phase

### Techniques Used

- **Code minification** - Variable shortening and dead code removal
- **Procedural assets** - No external images or audio files
- **Mathematical graphics** - Algorithmic visual generation
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

Built with ✨ by [Afton Gauntlett](https://github.com/aftongauntlett) • Game Developer practicing for js13k Competition 2025
