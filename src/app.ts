import * as PIXI from 'pixi.js';
import { Background } from './classes/Background';
import { AnimationManager } from './classes/AnimationManager';
import { Player } from './classes/Player';
import { InputManager } from './classes/InputManager';
import { AudioManager } from './classes/AudioManager';
import { Mushroom } from './classes/Enemies/Mushroom';
import { PlayerInterface } from './classes/PlayerInterface';

// Create PIXI Application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

document.body.appendChild(app.view as unknown as Node);

const background = new Background('./public/Backgrounds/CastleBG.jpg', app);
const animationManager = new AnimationManager();
const inputManager = new InputManager();
const audioManager = new AudioManager();
// audioManager.playSound('ingameMusic');
// audioManager.setVolume('ingameMusic', 0.03);
const player = new Player(animationManager, app, inputManager, audioManager);
const mushroom = new Mushroom(animationManager, app);
const playerInterface = new PlayerInterface(app, player);

// Resize PIXI Application when the window is resized
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  playerInterface.resizeInterface(app.screen.width, app.screen.height);
});

// Main game loop
app.ticker.add(() => {
  player.handlePlayerMovement();
  player.updatePlayerAnimation();

  mushroom.update();
});
