import * as PIXI from 'pixi.js';
import { Background } from './classes/Background';
import { AnimationManager } from './classes/AnimationManager';
import { Player } from './classes/Player';
import { InputManager } from './classes/InputManager';
import { AudioManager } from './classes/AudioManager';
import { Mushroom } from './classes/Enemies/Mushroom';
import { PlayerInterface } from './classes/UI/PlayerInterface';
import { DeathScreen } from './classes/UI/DeathScreen';
import { Coin } from './classes/Money/Coin';
import { Eye } from './classes/Enemies/Eye';
import { Enemy } from './classes/Enemies/Enemy';
import { Skeleton } from './classes/Enemies/Skeleton';
import { Diamond } from './classes/Money/Diamond';
import { MegaDiamond } from './classes/Money/MegaDiamond';
import { Merchant } from './classes/Merchant';
import { Knife } from './classes/Weapons/Knife';
import { Kebab } from './classes/Weapons/Kebab';
import { Timer } from './classes/UI/Timer';
import { WinScreen } from './classes/UI/WinScreen';

export class Game {
  private app: PIXI.Application;
  private background: Background;
  private animationManager: AnimationManager;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private playerInterface: PlayerInterface;
  private player: Player;
  private merchant: Merchant;
  private deathScreen: DeathScreen;
  private timer: Timer;
  private winScreen: WinScreen;
  private gameActive: boolean = true;
  private enemies: Enemy[] = [];
  private coins: Coin[] = [];
  private waveIntervals: number[] = [300, 240, 180, 120, 60];
  private currentWave: number = 0;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    document.body.appendChild(this.app.view as unknown as Node);

    this.background = new Background('/Backgrounds/CastleBG.webp', this.app);
    this.animationManager = new AnimationManager();
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();
    this.timer = new Timer(300);
    this.playerInterface = new PlayerInterface(this.app);
    this.deathScreen = new DeathScreen(this.app, this.resetGame.bind(this));
    this.winScreen = new WinScreen(this.app, this.resetGame.bind(this));
    this.player = new Player(
      this.animationManager,
      this.app,
      this.inputManager,
      this.audioManager,
      this.playerInterface,
      this.deathScreen,
      this.stopEnemies.bind(this)
    );
    this.merchant = new Merchant(
      this.app,
      this.animationManager,
      this.playerInterface,
      this.player
    );

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

  private updateRenderingOrder(): void {
    // Sort enemies based on their y-coordinate
    this.enemies.sort((a, b) => a.getSprite().y - b.getSprite().y);

    // Remove and re-add enemies to the stage in the correct order
    this.enemies.forEach((enemy) => {
      this.app.stage.removeChild(enemy.getSprite());
      this.app.stage.addChild(enemy.getSprite());
    });

    // Ensure player is rendered on top of enemies
    this.app.stage.removeChild(this.player.getSprite());
    this.app.stage.addChild(this.player.getSprite());

    // Ensure background is rendered behind everything
    this.app.stage.removeChild(this.background.getSprite());
    this.app.stage.addChildAt(this.background.getSprite(), 0);
  }

  private gameLoop(): void {
    if (this.gameActive) {
      this.timer.update();
      const timerString = this.timer.getTimeString();
      this.playerInterface.updateTimer(timerString);

      this.player.handlePlayerInput();
      this.player.updatePlayerAnimation();

      const playerKnives = this.player.getKnives();
      const playerCursedEyes = this.player.getEyes();
      const playerKebabs = this.player.getKebabs();
      const playerProjectiles = [
        ...playerKnives,
        ...playerCursedEyes,
        ...playerKebabs,
      ];

      playerProjectiles.forEach((projectile) => {
        projectile.update();
        if (projectile instanceof Knife || projectile instanceof Kebab) {
          projectile.mirrorImage();
        }
        for (const enemy of this.enemies) {
          const deathState = enemy.getDeathState();
          if (deathState) {
            if (enemy instanceof Mushroom) {
              const coin = new Coin(
                this.app,
                enemy.getSprite().x,
                enemy.getSprite().y,
                '/Shop/coin.png'
              );
              this.coins.push(coin);
            }
            if (enemy instanceof Eye) {
              const coin = new Diamond(
                this.app,
                enemy.getSprite().x,
                enemy.getSprite().y,
                '/Shop/diamond.png'
              );
              this.coins.push(coin);
            }
            if (enemy instanceof Skeleton) {
              const coin = new MegaDiamond(
                this.app,
                enemy.getSprite().x,
                enemy.getSprite().y,
                '/Shop/megaDiamond.png'
              );
              this.coins.push(coin);
            }

            const index = this.enemies.indexOf(enemy);
            this.enemies.splice(index, 1);
          }
          if (!deathState) {
            projectile.checkEnemyCollision(this.enemies);
          }
        }
      });

      this.player.checkCoinCollision(this.coins);

      this.merchant.checkPlayerCollision(this.player);

      this.updateRenderingOrder();

      for (const enemy of this.enemies) {
        if (!enemy.getDeathState()) {
          enemy.update();
        }

        this.player.checkProjectileCollision(enemy.getProjectiles());
      }
    }
    this.checkForNewWave();

    if (this.timer.getTime() === 0) {
      this.stopEnemies();
      this.winScreen.showWinScreen();
    }
  }

  stopEnemies(): void {
    this.gameActive = false;
    for (const enemy of this.enemies) {
      if (
        enemy instanceof Mushroom ||
        enemy instanceof Eye ||
        enemy instanceof Skeleton
      ) {
        enemy.switchToStandingAnimation();
      }
    }
  }

  private removeEnemies(): void {
    for (const enemy of this.enemies) {
      this.app.stage.removeChild(enemy.getSprite());
      enemy.projectiles.forEach((projectile) => projectile.destroy());
      enemy.projectiles = [];
    }
    this.enemies = [];
  }

  private removeCoins(): void {
    for (const coin of this.coins) {
      this.app.stage.removeChild(coin.getSprite());
    }
    this.coins = [];
  }

  resetGame(): void {
    this.app.ticker.stop();

    this.removeEnemies();

    this.removeCoins();

    this.gameActive = true;

    this.player.resetPlayer();

    this.playerInterface.resetCoins();

    this.currentWave = 0;

    this.timer.resetTimer();

    this.app.ticker.start();
  }

  private checkForNewWave(): void {
    const remainingTime = this.waveIntervals[this.currentWave];

    if (this.timer.getTime() <= remainingTime) {
      this.startWave();
    }
  }

  private startWave(): void {
    this.currentWave++;

    this.spawnEnemiesForWave(this.currentWave);
  }

  private spawnEnemiesForWave(waveNumber: number): void {
    switch (waveNumber) {
      case 1:
        for (let i = 0; i < 10; i++) {
          const mushroom = new Mushroom(this.animationManager, this.app);
          this.app.stage.addChild(mushroom.getSprite());
          this.enemies.push(mushroom);
        }
        break;
      case 2:
        for (let i = 0; i < 5; i++) {
          const mushroom = new Mushroom(this.animationManager, this.app);
          this.app.stage.addChild(mushroom.getSprite());
          this.enemies.push(mushroom);
        }

        for (let i = 0; i < 5; i++) {
          const eye = new Eye(this.animationManager, this.app);
          this.app.stage.addChild(eye.getSprite());
          this.enemies.push(eye);
        }
        break;
      case 3:
        for (let i = 0; i < 15; i++) {
          const eye = new Eye(this.animationManager, this.app);
          this.app.stage.addChild(eye.getSprite());
          this.enemies.push(eye);
        }
        break;
      case 4:
        for (let i = 0; i < 5; i++) {
          const eye = new Eye(this.animationManager, this.app);
          this.app.stage.addChild(eye.getSprite());
          this.enemies.push(eye);
        }

        for (let i = 0; i < 5; i++) {
          const skeleton = new Skeleton(this.animationManager, this.app);
          this.app.stage.addChild(skeleton.getSprite());
          this.enemies.push(skeleton);
        }
        break;
      case 5:
        for (let i = 0; i < 15; i++) {
          const skeleton = new Skeleton(this.animationManager, this.app);
          this.app.stage.addChild(skeleton.getSprite());
          this.enemies.push(skeleton);
        }
        break;
    }
  }

  start(): void {
    // This was added to build the app
    this.app.ticker.start();
    this.background.changeBackground();
  }
}

const game = new Game();
game.start();
