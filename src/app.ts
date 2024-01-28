import * as PIXI from 'pixi.js';

// Create PIXI Application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
});

// Append PIXI Application to the document body
document.body.appendChild(app.view as unknown as Node);

// Resize PIXI Application when the window is resized
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
