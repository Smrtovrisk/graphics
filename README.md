# Crystal Tunnel Shader

An interactive WebGL shader graphics demo featuring a mesmerizing infinite neon crystal tunnel effect.

## Features

- **Raymarching Engine** - Real-time 3D rendering using signed distance functions (SDFs)
- **Morphing Crystals** - Octahedrons and 3D crosses that smoothly morph over time
- **Interactive Camera** - Drag with mouse to look around the tunnel
- **Dynamic Lighting** - Fresnel effects, specular highlights, and neon glow
- **Infinite Tunnel** - Procedural repetition creates endless depth
- **Visual Effects** - Vignette, fog, scanlines, and color palette cycling

## Live Demo

Visit: https://smrtovrisk.github.io/graphics

## Getting Started

### Install dependencies
```
yarn install
```

### Start the development server
```
yarn start
```

### Build for production
```
yarn build
```

### Deploy to GitHub Pages
```
yarn deploy
```

## Technical Details

- **Framework**: React.js + p5.js for WebGL context
- **Shaders**: GLSL ES 3.0 fragment shaders
- **Rendering**: Sphere-traced raymarching at 80 steps max
- **SDF Primitives**: Box, Octahedron, Cross (combined via CSG)

## Controls

- **Drag Mouse**: Rotate camera view
- Automatic camera movement through tunnel with gentle sway

## Shader Techniques Used

- Signed Distance Functions (SDFs)
- Raymarching / Sphere Tracing
- Fresnel reflection approximation
- Cosine color palettes
- Domain repetition for infinite geometry
- Soft shadows and ambient occlusion hints
