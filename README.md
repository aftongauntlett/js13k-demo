# Atomic Puzzle Game - js13k Demo

[![js13k Competition](https://img.shields.io/badge/js13k-2025-orange?logo=javascript)](https://js13kgames.com/)
[![Build Status](https://img.shields.io/badge/build-ready-success?logo=github-actions)](https://github.com/aftongauntlett/js13k-demo/actions)
[![Game Size](https://img.shields.io/badge/size-%3C13KB-brightgreen?logo=webpack)](https://github.com/aftongauntlett/js13k-demo)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/aftongauntlett/js13k-demo?logo=git)](https://github.com/aftongauntlett/js13k-demo/commits)

A physics-based puzzle game demonstrating real atomic structures through interactive orbital mechanics. Build authentic elements from Hydrogen to Nitrogen by guiding electrons into their proper electron shells using electromagnetic fields. This educational game teaches atomic structure while providing an engaging puzzle experience, designed for the js13k competition with a strict 13KB size limit.

## How to Play

- **Blue electrons** are attracted to your mouse cursor (negative charge)
- **Orange electrons** are repelled by your mouse cursor (positive charge)
- Guide electrons into matching colored orbitals to complete each atom
- Each level represents a real element with accurate electron configuration
- Orbitals rotate with gaps - time your movements carefully to enter shells
- Learn about 1s, 2s, and 2p electron shells as you progress through elements
- Click to advance to the next element when the current atom is complete

## Educational Elements

**Level 1: Hydrogen (H)** - 1 electron in 1s orbital  
**Level 2: Helium (He)** - 2 electrons filling the first shell  
**Level 3: Lithium (Li)** - 2 electrons in 1s, 1 electron in 2s  
**Level 4: Carbon (C)** - 1s² 2s² 2p² electron configuration  
**Level 5: Nitrogen (N)** - 1s² 2s² 2p³ with three p-orbital electrons

## Development

```bash
npm run dev    # Start development server
npm run build  # Build final game
```

---

Built for js13k Competition practice by [Afton Gauntlett](https://github.com/aftongauntlett)
