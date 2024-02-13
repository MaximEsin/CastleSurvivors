import * as PIXI from 'pixi.js';
import { Background } from '../Background';
import { AnimationManager } from '../Managers/AnimationManager';
import { Player } from '../Player';
import { InputManager } from '../Managers/InputManager';
import { AudioManager } from '../Managers/AudioManager';
import { Mushroom } from '../Enemies/Mushroom';
import { PlayerInterface } from '../UI/PlayerInterface';
import { DeathScreen } from '../UI/DeathScreen';
import { Coin } from '../Money/Coin';
import { Eye } from '../Enemies/Eye';
import { Enemy } from '../Enemies/Enemy';
import { Skeleton } from '../Enemies/Skeleton';
import { Diamond } from '../Money/Diamond';
import { MegaDiamond } from '../Money/MegaDiamond';
import { Merchant } from '../Merchant';
import { Timer } from '../UI/Timer';
import { WinScreen } from '../UI/WinScreen';

export class GameManager {
  private app: PIXI.Application;
  private backgroundLayer: PIXI.Container;
  private gameLayer: PIXI.Container;
  private interfaceLayer: PIXI.Container;
  private endScreenLayer: PIXI.Container;
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
  private currentWave: number = 0;
  private waveIntervals: number[] = [300, 240, 180, 120, 60];

  constructor(app: PIXI.Application) {
    this.app = app;

    this.backgroundLayer = new PIXI.Container();
    this.gameLayer = new PIXI.Container();
    this.interfaceLayer = new PIXI.Container();
    this.endScreenLayer = new PIXI.Container();

    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.gameLayer);
    this.app.stage.addChild(this.interfaceLayer);
    this.app.stage.addChild(this.endScreenLayer);

    this.background = new Background(
      '/Backgrounds/CastleBG.webp',
      this.app,
      this.backgroundLayer
    );
    this.animationManager = new AnimationManager();
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();
    this.timer = new Timer(300);
    this.playerInterface = new PlayerInterface(this.app, this.interfaceLayer);
    this.deathScreen = new DeathScreen(
      this.app,
      this.resetGame.bind(this),
      this.endScreenLayer
    );
    this.winScreen = new WinScreen(
      this.app,
      this.resetGame.bind(this),
      this.endScreenLayer
    );
    this.player = new Player(
      this.animationManager,
      this.app,
      this.inputManager,
      this.audioManager,
      this.playerInterface,
      this.deathScreen,
      this.stopEnemies.bind(this),
      this.gameLayer
    );
    this.merchant = new Merchant(
      this.app,
      this.gameLayer,
      this.animationManager,
      this.playerInterface,
      this.player
    );

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private gameLoop(deltaMS: number): void {
    if (this.gameActive) {
      this.updateTimer(deltaMS);
      this.player.update(this.coins);

      this.updateProjectiles();

      this.merchant.checkPlayerCollision(this.player);

      this.updateRenderingOrder();
      this.spriteCleaner();

      this.updateEnemies();
    }

    this.checkForNewWave();

    this.checkForWaveCompletion();
  }

  private updateTimer(deltaMS: number): void {
    this.timer.update(deltaMS);
    const timerString = this.timer.getTimeString();
    this.playerInterface.updateTimer(timerString);
  }

  private checkForWaveCompletion(): void {
    if (this.timer.getTime() === 0) {
      this.stopEnemies();
      this.winScreen.showWinScreen();
    }
  }

  private updateEnemies(): void {
    for (const enemy of this.enemies) {
      if (!enemy.getDeathState()) {
        enemy.update();
      }

      this.player.checkProjectileCollision(enemy.getProjectiles());
    }
  }

  private updateProjectiles(): void {
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
      for (const enemy of this.enemies) {
        const deathState = enemy.getDeathState();
        if (deathState) {
          if (enemy instanceof Mushroom) {
            const coin = new Coin(
              this.app,
              enemy.getSprite().x,
              enemy.getSprite().y,
              '/Shop/coin.png',
              this.gameLayer
            );
            this.coins.push(coin);
          }
          if (enemy instanceof Eye) {
            const coin = new Diamond(
              this.app,
              enemy.getSprite().x,
              enemy.getSprite().y,
              '/Shop/diamond.png',
              this.gameLayer
            );
            this.coins.push(coin);
          }
          if (enemy instanceof Skeleton) {
            const coin = new MegaDiamond(
              this.app,
              enemy.getSprite().x,
              enemy.getSprite().y,
              '/Shop/megaDiamond.png',
              this.gameLayer
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
  }

  private setUpGlobalEventListeners() {
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
          this.audioManager.pauseAllSounds();
        } else {
          this.app.ticker.start();
          this.audioManager.resumeAllPausedSounds();
        }
      }
    });
  }

  private updateRenderingOrder(): void {
    this.enemies.sort((a, b) => a.getSprite().y - b.getSprite().y);

    this.gameLayer.sortableChildren = true;

    this.gameLayer.addChild(this.player.getSprite());

    this.backgroundLayer.addChildAt(this.background.getSprite(), 0);

    this.gameLayer.sortChildren();
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
      this.gameLayer.removeChild(enemy.getSprite());
      enemy.projectiles.forEach((projectile) => projectile.destroy());
      enemy.projectiles = [];
    }
    this.enemies = [];
  }

  private removeCoins(): void {
    for (const coin of this.coins) {
      this.gameLayer.removeChild(coin.getSprite());
    }
    this.coins = [];
  }

  private spriteCleaner() {
    this.enemies.forEach((enemy) => {
      if (enemy.isDead) {
        this.gameLayer.removeChild(enemy.getSprite());
      }
    });
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

  public checkForNewWave(): void {
    const remainingTime = this.waveIntervals[this.currentWave];

    if (this.timer.getTime() <= remainingTime) {
      console.log('p');
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
          const mushroom = new Mushroom(
            this.animationManager,
            this.app,
            this.gameLayer
          );
          this.gameLayer.addChild(mushroom.getSprite());
          this.enemies.push(mushroom);
        }
        break;
      case 2:
        for (let i = 0; i < 5; i++) {
          const mushroom = new Mushroom(
            this.animationManager,
            this.app,
            this.gameLayer
          );
          this.gameLayer.addChild(mushroom.getSprite());
          this.enemies.push(mushroom);
        }

        for (let i = 0; i < 5; i++) {
          const eye = new Eye(this.animationManager, this.app, this.gameLayer);
          this.gameLayer.addChild(eye.getSprite());
          this.enemies.push(eye);
        }
        break;
      case 3:
        for (let i = 0; i < 15; i++) {
          const eye = new Eye(this.animationManager, this.app, this.gameLayer);
          this.gameLayer.addChild(eye.getSprite());
          this.enemies.push(eye);
        }
        break;
      case 4:
        for (let i = 0; i < 5; i++) {
          const eye = new Eye(this.animationManager, this.app, this.gameLayer);
          this.gameLayer.addChild(eye.getSprite());
          this.enemies.push(eye);
        }

        for (let i = 0; i < 5; i++) {
          const skeleton = new Skeleton(
            this.animationManager,
            this.app,
            this.gameLayer
          );
          this.gameLayer.addChild(skeleton.getSprite());
          this.enemies.push(skeleton);
        }
        break;
      case 5:
        for (let i = 0; i < 15; i++) {
          const skeleton = new Skeleton(
            this.animationManager,
            this.app,
            this.gameLayer
          );
          this.gameLayer.addChild(skeleton.getSprite());
          this.enemies.push(skeleton);
        }
        break;
    }
  }

  start(): void {
    this.setUpGlobalEventListeners();
    this.app.ticker.start();
    this.background.changeBackground();
  }
}
