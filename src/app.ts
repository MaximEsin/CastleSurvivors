import * as PIXI from 'pixi.js';
import { Background } from './classes/Background';
import { AnimationManager } from './classes/AnimationManager';
import { Player } from './classes/Player';
import { InputManager } from './classes/InputManager';
import { AudioManager } from './classes/AudioManager';
import { Mushroom } from './classes/Enemies/Mushroom';
import { PlayerInterface } from './classes/UI/PlayerInterface';

// Create PIXI Application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

document.body.appendChild(app.view as unknown as Node);

let gameActive: boolean = true;

const background = new Background('./public/Backgrounds/CastleBG.jpg', app);
const animationManager = new AnimationManager();
const inputManager = new InputManager();
const audioManager = new AudioManager();
const playerInterface = new PlayerInterface(app);
// audioManager.playSound('ingameMusic');
// audioManager.setVolume('ingameMusic', 0.03);
const player = new Player(
  animationManager,
  app,
  inputManager,
  audioManager,
  playerInterface
);
const mushroom = new Mushroom(animationManager, app);

export function stopGame(): void {
  gameActive = false;

  mushroom.switchToStandingAnimation();
}

// Resize PIXI Application when the window is resized
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  playerInterface.resizeInterface(app.screen.width, app.screen.height);
});

// Main game loop
app.ticker.add(() => {
  if (gameActive) {
    player.handlePlayerMovement();
    player.updatePlayerAnimation();

    mushroom.update();
    player.checkProjectileCollision(mushroom.getProjectiles());
  }
});
