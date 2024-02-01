import * as PIXI from 'pixi.js';
import { Background } from './classes/Background';
import { AnimationManager } from './classes/AnimationManager';
import { Player } from './classes/Player';
import { InputManager } from './classes/InputManager';
import { AudioManager } from './classes/AudioManager';
import { Mushroom } from './classes/Enemies/Mushroom';
import { PlayerInterface } from './classes/UI/PlayerInterface';
import { DeathScreen } from './classes/UI/DeathScreen';

export class Game {
  private app: PIXI.Application;
  private background: Background;
  private animationManager: AnimationManager;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private playerInterface: PlayerInterface;
  private player: Player;
  private deathScreen: DeathScreen;
  private gameActive: boolean = true;
  private mushrooms: Mushroom[] = [];

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    document.body.appendChild(this.app.view as unknown as Node);

    this.background = new Background(
      './public/Backgrounds/CastleBG.jpg',
      this.app
    );
    this.animationManager = new AnimationManager();
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();
    this.playerInterface = new PlayerInterface(this.app);
    this.deathScreen = new DeathScreen(this.app, this.resetGame.bind(this));
    this.player = new Player(
      this.animationManager,
      this.app,
      this.inputManager,
      this.audioManager,
      this.playerInterface,
      this.deathScreen,
      this.stopGame.bind(this)
    );

    this.createMushrooms();

    // Resize PIXI Application when the window is resized
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.playerInterface.resizeInterface(
        this.app.screen.width,
        this.app.screen.height
      );
    });

    // Main game loop
    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private createMushrooms() {
    for (let i = 0; i < 6; i++) {
      const mushroom = new Mushroom(this.animationManager, this.app);
      this.app.stage.addChild(mushroom.getSprite());
      this.mushrooms.push(mushroom);
    }
  }

  private gameLoop(): void {
    if (this.gameActive) {
      this.player.handlePlayerInput();
      this.player.updatePlayerAnimation();

      const playerKnives = this.player.getKnives();

      playerKnives.forEach((knife) => {
        knife.update();
        knife.mirrorImage();
        for (const mushroom of this.mushrooms) {
          const deathState = mushroom.getDeathState();
          if (!deathState) {
            knife.checkEnemyCollision(this.mushrooms);
          }
        }
      });

      for (const mushroom of this.mushrooms) {
        this.player.checkCoinCollision(mushroom.getCoins());
        if (!mushroom.getDeathState()) {
          mushroom.update();
        }

        this.player.checkProjectileCollision(mushroom.getProjectiles());
      }
    }
  }

  stopGame(): void {
    this.gameActive = false;
    for (const mushroom of this.mushrooms) {
      mushroom.switchToStandingAnimation();
    }
  }

  resetGame(): void {
    this.app.ticker.stop();

    this.gameActive = true;

    this.player.resetPlayer();
    for (const mushroom of this.mushrooms) {
      mushroom.resetMushroom();
    }

    this.playerInterface.resetCoins();

    this.app.ticker.start();
  }
}

const game = new Game();
