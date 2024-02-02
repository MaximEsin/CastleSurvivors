import * as PIXI from 'pixi.js';
import { Background } from './classes/Background';
import { AnimationManager } from './classes/AnimationManager';
import { Player } from './classes/Player';
import { InputManager } from './classes/InputManager';
import { AudioManager } from './classes/AudioManager';
import { Mushroom } from './classes/Enemies/Mushroom';
import { PlayerInterface } from './classes/UI/PlayerInterface';
import { DeathScreen } from './classes/UI/DeathScreen';
import { Coin } from './classes/Coin';
import { Eye } from './classes/Enemies/Eye';
import { Enemy } from './classes/Enemies/Enemy';

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
  private enemies: Enemy[] = [];
  private coins: Coin[] = [];

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
      this.stopEnemies.bind(this)
    );

    this.createEnemies();

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.playerInterface.resizeInterface(
        this.app.screen.width,
        this.app.screen.height
      );
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.app.ticker.started) {
          this.app.ticker.stop();
        } else {
          this.app.ticker.start();
        }
      }
    });

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private createEnemies() {
    for (let i = 0; i < 2; i++) {
      const mushroom = new Mushroom(this.animationManager, this.app);
      this.app.stage.addChild(mushroom.getSprite());
      this.enemies.push(mushroom);
    }

    for (let i = 0; i < 3; i++) {
      const eye = new Eye(this.animationManager, this.app);
      this.app.stage.addChild(eye.getSprite());
      this.enemies.push(eye);
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
        for (const enemy of this.enemies) {
          const deathState = enemy.getDeathState();
          if (deathState) {
            const coin = new Coin(
              this.app,
              enemy.getSprite().x,
              enemy.getSprite().y
            );
            this.coins.push(coin);

            const index = this.enemies.indexOf(enemy);
            this.enemies.splice(index, 1);
          }
          if (!deathState) {
            knife.checkEnemyCollision(this.enemies);
          }
        }
      });

      this.player.checkCoinCollision(this.coins);

      for (const enemy of this.enemies) {
        if (!enemy.getDeathState()) {
          enemy.update();
        }

        this.player.checkProjectileCollision(enemy.getProjectiles());
      }
    }
  }

  stopEnemies(): void {
    this.gameActive = false;
    for (const enemy of this.enemies) {
      if (enemy instanceof Mushroom || enemy instanceof Eye) {
        enemy.switchToStandingAnimation();
      }
    }
  }

  resetGame(): void {
    this.app.ticker.stop();

    this.gameActive = true;

    this.player.resetPlayer();
    for (const enemy of this.enemies) {
      enemy.resetEnemy();
    }

    this.playerInterface.resetCoins();

    this.app.ticker.start();
  }
}

const game = new Game();
