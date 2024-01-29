import * as PIXI from 'pixi.js';
import { Background } from './classes/Background';
import { AnimationManager } from './classes/AnimationManager';
import { Player } from './classes/Player';
import { InputManager } from './classes/InputManager';

// Create PIXI Application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

document.body.appendChild(app.view as unknown as Node);

// Create a background instance
const background = new Background('./public/Backgrounds/CastleBG.jpg', app);

// Create an animation manager instance
const animationManager = new AnimationManager();

const inputManager = new InputManager();

// Create a player instance
const player = new Player(animationManager, app, inputManager);

// Resize PIXI Application when the window is resized
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

// Main game loop
app.ticker.add(() => {
  player.handlePlayerMovement();
  player.updatePlayerAnimation();
});
