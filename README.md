# ⚛️ Orbital Order (Aufbau)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![js13k](https://img.shields.io/badge/js13k-practice-orange.svg)](https://js13kgames.com/)
[![Size](https://img.shields.io/badge/size-8.2KB-brightgreen.svg)](#)

> A physics-based puzzle game built with vanilla JavaScript and Canvas 2D. Guide electrons into atomic orbitals following the Aufbau principle while staying under the 13KB JS13K size limit.

**Tech Stack:** Vanilla JS • Canvas 2D • Web Audio API • Terser

**[Play the game →](https://orbital-order.aftongauntlett.com/)** | **[View Source →](https://github.com/aftongauntlett/js13k-demo)**

---

## Table of Contents

- [Motivation](#motivation)
- [Game Overview](#game-overview)
- [Technical Architecture & Implementation](#technical-architecture--implementation)
  - [Project Structure](#project-structure)
  - [Core Systems](#core-systems)
  - [Libraries & Tools](#libraries--tools)
  - [Build Process & Optimization](#build-process--optimization)
- [Accessibility & UX Considerations](#accessibility--ux-considerations)
- [Build & Deployment Instructions](#build--deployment-instructions)
- [Challenges & Lessons Learned](#challenges--lessons-learned)
- [What's Next](#whats-next)

---

## Motivation

This project began as a warm-up for the JS13K 2025 competition. I wanted to practice working within extreme size constraints while building something complete, polished, and educational. The concept emerged from experimenting with attraction/repulsion mechanics—what started as a lightning prototype evolved into an atomic orbital theme after the visual elements naturally resembled electron shells.

**Key Goals:**

- Master Canvas 2D rendering and particle systems
- Learn aggressive code optimization and build tooling (Terser, minification)
- Implement procedural audio using only Web Audio API
- Practice scoping and finishing a small project end-to-end

---

## Game Overview

**Players guide electrons into atomic orbitals by creating electromagnetic fields with mouse movement.** Blue s-electrons are attracted to the cursor while orange p-electrons are repelled. Complete 6 elements (H → He → Li → C → N → O) by filling orbitals following the Aufbau principle (1s² → 2s² → 2p⁶). A two-hit knockout penalty system adds precision challenge—hit an occupied orbital twice and the electron ejects.

---

## Technical Architecture & Implementation

**Single-file architecture with class-based vanilla JavaScript, aggressive Terser minification, and procedural audio—optimized from 47KB source to 8.2KB zipped.**

### Project Structure

```
js13k-demo/
├── src/
│   ├── index.html                      # Single-file HTML template with inline CSS
│   ├── GameGolfed.js                   # Main game loop and coordination (class G)
│   ├── components/
│   │   ├── ElectronGolfed.js           # Electron physics and collision logic (class E)
│   │   └── TutorialGolfed.js           # Interactive tutorial system (class T)
│   └── systems/
│       ├── OrbitalSystemGolfed.js      # Orbital rendering and level data (class O)
│       └── AudioSystemGolfed.js        # Procedural audio engine (class A)
├── build/
│   └── buildGolfed.js                  # Build script: concatenate, minify, inline
├── dist/
│   └── index.html                      # Single-file production build (~8.2KB zipped)
├── package.json                        # Dependencies and scripts
└── vercel.json                         # Deployment configuration
```

### Core Systems

**Five single-letter classes handle game logic, physics, rendering, audio, and tutorial interactions.**

#### **Class G (GameGolfed.js)** - Main Game Controller

- Canvas initialization and input event handling
- Game loop with requestAnimationFrame
- Electron spawning and particle system management
- Keyboard shortcuts (M for audio toggle, ESC for tutorial)
- Coordinates between orbital system, audio system, and tutorial

#### **Class E (ElectronGolfed.js)** - Electron Physics

- Position, velocity, and type (s-orbital or p-orbital)
- Attraction/repulsion forces based on mouse position
- Collision detection with orbitals
- Visual rendering with glow effects and trails

#### **Class O (OrbitalSystemGolfed.js)** - Orbital System

- Level data encoding: element name, atomic number, mass, symbol
- Orbital position, radius, and type configuration
- Aufbau principle validation (lower energy levels fill first)
- Orbital state rendering (empty, filled, rejected, shaking)
- Level transition and completion logic

#### **Class A (AudioSystemGolfed.js)** - Procedural Audio

- Web Audio API integration with no external sound files
- Buffer-based sound synthesis (sine waves, noise, sawtooth)
- Envelope generation (attack, release) for each sound effect
- Audio context initialization on user interaction (browser requirement)
- Delay and feedback nodes for ambient background music

#### **Class T (TutorialGolfed.js)** - Tutorial System

- Interactive tutorial triggered by game events (electron spawn, orbital interactions)
- Context-sensitive help messages
- Non-intrusive overlay with dismissible prompts

### Libraries & Tools

**Zero external libraries for runtime—only build-time dependencies for minification and local development.**

| Tool                   | Purpose                 | Justification                                                                                                       |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Terser**             | JavaScript minification | Aggressive compression with 3-pass optimization, property mangling, and unsafe transforms. Achieved ~47% reduction. |
| **Python http.server** | Development server      | Zero-dependency local server for testing. No build tools needed during development.                                 |
| **Canvas 2D API**      | Rendering               | Lightweight alternative to WebGL. Sufficient for 2D particle effects, gradients, and compositing.                   |
| **Web Audio API**      | Procedural audio        | Generates all sound effects from code—no audio files needed. Saves significant bytes.                               |

### Build Process & Optimization

**Custom Node.js build script concatenates source files, minifies with Terser (3-pass compression, property mangling), and inlines everything into a single HTML file.**

```bash
npm run build
```

**Build Steps:**

1. Read all source JavaScript files from `src/`
2. Concatenate in dependency order (components → systems → game)
3. Minify with Terser:
   - Top-level and property mangling
   - 3-pass compression
   - Remove console.log and debugger statements
   - Enable unsafe optimizations (arrows, math, prototypes)
4. Inject minified JS into HTML template between markers
5. Output single `dist/index.html` file

**Compression Results:**

- **Original source:** ~47KB
- **Minified output:** ~25KB uncompressed
- **Gzipped size:** ~8.2KB (fits well under 13KB limit)
- **Compression ratio:** 47% reduction

**Key Optimization Techniques:**

- Single-letter class names (G, E, O, A, T) to reduce identifier length
- Property name mangling for all internal methods
- Reused mathematical constants (e.g., `PI2 = 6.28` instead of `Math.PI * 2`)
- Inline styles and SVG favicon (no external resources)
- Canvas state management with save/restore to minimize API calls

---

## Accessibility & UX Considerations

**Interactive tutorial system and visual feedback prioritize discoverability, but color dependency and custom cursor present accessibility challenges.**

### Interaction Design

- **Tutorial system:** Interactive, event-driven help instead of walls of text. Players learn by doing.
- **Visual feedback:** Orbitals glow red when invalid, shake on collision, gray out when ejected.
- **Audio cues:** Optional sound effects for capture, rejection, and collisions. Toggled with 'M' key.
- **Seamless transitions:** Level changes happen in-place without pausing gameplay flow.

### Accessibility Notes

- **Cursor visibility:** Custom cursor (none) with visual field representation. May be difficult for users with motor impairments.
- **Color dependency:** Blue/orange distinction critical for gameplay. Not colorblind-friendly.
- **Audio:** Optional and can be muted. Does not convey essential information.
- **Keyboard controls:** ESC and M keys for tutorial/audio toggles.

**Future Improvements:** Add colorblind mode (pattern/texture differentiation), improve cursor visibility options, add alternative input methods.

---

## Build & Deployment Instructions

**Simple setup with Node.js for minification and Python for local development server—no complex toolchains required.**

### Local Development

**Requirements:**

- Node.js (for Terser)
- Python 3 (for local server)

**Setup:**

```bash
# Clone the repository
git clone https://github.com/aftongauntlett/js13k-demo.git
cd js13k-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

**Development Mode Features:**

- Unminified source for debugging
- Live reload (manual refresh)
- Full console logging

### Production Build

```bash
# Build optimized single-file output
npm run build

# Output: dist/index.html (~8.2KB zipped)
```

**Test the production build:**

```bash
# Serve from dist/ directory
python3 -m http.server 8080 --directory dist
```

### JS13K Submission Preparation

```bash
# Create ZIP for contest submission
cd dist
zip -9 submission.zip index.html

# Check size
ls -lh submission.zip
# Should be under 13KB (13,312 bytes)
```

**Deployment:**

- Static hosting (Vercel, Netlify, GitHub Pages)
- Single HTML file—no build step required on server
- Configured via `vercel.json` for SPA routing

---

## Challenges & Lessons Learned

**This was my first complete game project and first time working with JS13K constraints—key insights around size optimization, build tooling, Canvas rendering, and procedural audio generation.**

<details>
<summary><strong>Technical Challenges (click to expand)</strong></summary>

### 1. Size Constraints Are Liberating

Working under 13KB forced ruthless prioritization. No libraries, no frameworks, no waste. Every feature had to justify its byte cost. This constraint led to creative solutions like procedural audio and single-file architecture.

### 2. Terser Configuration is an Art

Achieving 47% compression required experimentation with Terser's unsafe optimizations. Property mangling broke the game several times until I understood which patterns were safe. The 3-pass compression setting provided diminishing returns but saved a few hundred bytes.

### 3. Canvas State Management

Early versions had rendering bugs from improperly nested save/restore calls. Learning to treat Canvas transforms and styles as a stack clarified the rendering pipeline and improved performance.

### 4. Procedural Audio is Hard

Generating pleasant-sounding effects from raw waveforms took iteration. Envelope shaping (attack/release) made the difference between harsh beeps and smooth tones. Delay/feedback nodes added ambient depth without additional bytes.

### 5. Build Tool Integration

First time setting up a custom build script. Understanding how to parse HTML markers, inject code, and preserve script context taught me practical build pipeline design.

</details>

<details>
<summary><strong>Development Insights (click to expand)</strong></summary>

### Scope Control Matters

Finishing a small project completely is more valuable than abandoning a large one. I cut an infinite mode feature that caused state pollution—better to ship 6 polished levels than 6 levels plus a buggy bonus mode.

### Player Feedback Shapes UX

Early testers found level transitions jarring. Removing modal cards and making transitions seamless dramatically improved flow. The interactive tutorial replaced static instructions after playtesters skipped the original intro screen.

### AI as Research Assistant

Copilot helped with boilerplate and syntax. ChatGPT accelerated research into Web Audio API and Terser configuration. I still had to debug, refactor, and validate everything—AI shortened the path from idea to prototype but didn't remove the engineering work.

### What I'd Do Differently

- **Start with compression in mind:** Writing minification-friendly code from the start (shorter names, fewer properties) would have saved refactoring time.
- **Add unit tests:** Even simple tests for orbital validation logic would have caught bugs earlier.
- **Accessibility first:** Building colorblind support from the beginning is easier than retrofitting it.

</details>

---

## What's Next

**Potential enhancements include additional elements, competitive features, and improved accessibility.**

- Add levels up to Neon (element 10) or beyond
- Leaderboard with completion time tracking
- Colorblind-friendly visual modes (patterns/textures)
- Mobile touch controls
- Expanded tutorial covering real-world atomic applications

---

---

MIT License - Built with ✨ by [Afton Gauntlett](https://github.com/aftongauntlett)
