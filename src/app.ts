// src/main.ts
import * as PIXI from 'pixi.js';
import { Background } from './classes/Background';

// Create PIXI Application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

// Append PIXI Application to the document body
document.body.appendChild(app.view as unknown as Node);

// Create a background instance
const background = new Background('./public/Backgrounds/CastleBG.jpg', app);

// Resize PIXI Application when the window is resized
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
