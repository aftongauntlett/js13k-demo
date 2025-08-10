# Atomic Puzzle Game - js13k Practice/Learning Project

[![Build Status](https://img.shields.io/badge/build-ready-success?logo=github-actions)](https://github.com/aftongauntlett/js13k-demo/actions)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/aftongauntlett/js13k-demo?logo=git)](https://github.com/aftongauntlett/js13k-demo/commits)

> **Note**: This is a practice/learning project for the upcoming js13k competition. I know it's way over the 13KB limit - that was intentional! This served as my testing ground to experiment with game mechanics, audio systems, and educational content before the real competition starts. I had a blast building it and learned exactly what I need to focus on for the actual event.

A physics-based puzzle game demonstrating real atomic structures through interactive orbital mechanics. Build authentic elements from Hydrogen to Nitrogen by guiding electrons into their proper electron shells using electromagnetic fields. This educational game teaches atomic structure while providing an engaging puzzle experience.

## What I Learned for the Real Competition

- **Audio Systems**: Implemented a full Web Audio API system with procedural sound generation - now I know how to make this much more compact
- **Game Architecture**: Experimented with modular systems (InputSystem, AudioSystem, OrbitalSystem) - learned what's essential vs. nice-to-have
- **Educational Content**: Balanced fun gameplay with accurate atomic physics - discovered the sweet spot for js13k
- **Size Optimization**: Identified exactly where the bloat comes from and what techniques work best for compression
- **Scope Management**: This taught me how to prioritize features for a 13KB constraint

## Features (The Full Experience)

**Immersive Audio** - Futuristic electronic soundscape with procedural Web Audio API  
**Educational Content** - Real atomic structures with fun facts about each element  
🎮 **Smooth Physics** - Electromagnetic field simulation with particle interactions  
**Polished Visuals** - Glowing effects, smooth animations, and atomic-themed UI  
**Progressive Learning** - Start with simple Hydrogen, build up to complex Nitrogen

## How to Play

- **Blue electrons** are attracted to your mouse cursor (negative charge)
- **Orange electrons** are repelled by your mouse cursor (positive charge)
- Guide electrons into matching colored orbitals to complete each atom
- Each level represents a real element with accurate electron configuration
- Orbitals rotate with gaps - time your movements carefully to enter shells
- Learn about 1s, 2s, and 2p electron shells as you progress through elements
- Click to advance to the next element when the current atom is complete
- **Press 'M' to toggle mute** - enjoy the futuristic electronic soundscape!

## Educational Elements

**Level 1: Hydrogen (H)** - 1 electron in 1s orbital  
**Level 2: Helium (He)** - 2 electrons filling the first shell  
**Level 3: Lithium (Li)** - 2 electrons in 1s, 1 electron in 2s  
**Level 4: Carbon (C)** - 1s² 2s² 2p² electron configuration  
**Level 5: Nitrogen (N)** - 1s² 2s² 2p³ with three p-orbital electrons

## For the Real js13k Competition

When the actual competition starts, I'll create a much more focused version:

- Strip down to core mechanics only
- Minimize audio to essential bleeps/bloops
- Reduce educational content to fit size constraints
- Focus on tight, addictive gameplay loop
- Use aggressive minification and compression techniques

This project taught me exactly what's possible and what needs to be cut for a 13KB limit.

## Development

```bash
npm run dev    # Start development server
npm run build  # Build final game (currently way over 13KB!)
```

---

Built as js13k Competition practice by [Afton Gauntlett](https://github.com/aftongauntlett) - Ready for the real challenge! 🚀
