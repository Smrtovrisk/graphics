import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const vertShaderUrl = process.env.PUBLIC_URL + '/shaders/vert.glsl';
const fragShaderUrl = process.env.PUBLIC_URL + '/shaders/frag.glsl';

function P5ShaderSketch() {
  const sketchRef = useRef();
  const p5Instance = useRef();


  useEffect(() => {
    let moves = [0, 0];
    let startRandom = Math.random();
    let pointerCount = 0;
    let theShader = null;

    const sketch = (p) => {
      p.setup = async () => {
        p.pixelDensity(1);
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        p.noStroke();
        // Load shaders asynchronously
        const [vertArr, fragArr] = await Promise.all([
          fetch(vertShaderUrl).then(res => res.text()),
          fetch(fragShaderUrl).then(res => res.text())
        ]);
        theShader = p.createShader(vertArr, fragArr);
        p.shader(theShader);
        p.canvas.style = 'width:100vw;height:100vh;display:block;position:fixed;top:0;left:0;z-index:0;';
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };

      p.mouseDragged = () => {
        moves[0] += p.mouseX - p.pmouseX;
        moves[1] += p.pmouseY - p.mouseY;
      };

      p.draw = () => {
        if (!theShader) return;
        pointerCount = p.mouseIsPressed ? 1 : 0;
  theShader.setUniform('resolution', [p.width, p.height]);
  theShader.setUniform('time', p.millis() / 1000.0);
  theShader.setUniform('move', moves);
  // pointerCount and startRandom are not used in the shader, so skip them
  p.rect(-p.width/2, -p.height/2, p.width, p.height); // Full canvas in WEBGL mode
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  return <div ref={sketchRef}></div>;
}

export default P5ShaderSketch;
