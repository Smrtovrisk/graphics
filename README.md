# graphics

This project is a React.js application bootstrapped with Create React App and uses Yarn as the package manager. The P5.js framework is installed for creative coding and graphics. GLSL shader support is enabled using glsl-canvas-js.

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

### Run tests
```
yarn test
```

## Using P5.js
You can import and use P5.js in your React components like this:

```js
import p5 from 'p5';
// ...your code
```

## Using GLSL Shaders
GLSL shaders can be rendered using the `glsl-canvas-js` package. See `src/App.js` for a basic example of rendering a fragment shader in a canvas element.

For more details, see the [P5.js documentation](https://p5js.org/reference/) and [glsl-canvas-js documentation](https://github.com/patriciogonzalezvivo/glslCanvas).
