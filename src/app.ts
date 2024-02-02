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
    this.timer = new Timer(300);
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
    this.merchant = new Merchant(
      this.app,
      this.animationManager,
      this.playerInterface,
      this.player
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

    for (let i = 0; i < 1; i++) {
      const skeleton = new Skeleton(this.animationManager, this.app);
      this.app.stage.addChild(skeleton.getSprite());
      this.enemies.push(skeleton);
    }
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
                './public/Shop/coin.png'
              );
              this.coins.push(coin);
            }
            if (enemy instanceof Eye) {
              const coin = new Diamond(
                this.app,
                enemy.getSprite().x,
                enemy.getSprite().y,
                './public/Shop/diamond.png'
              );
              this.coins.push(coin);
            }
            if (enemy instanceof Skeleton) {
              const coin = new MegaDiamond(
                this.app,
                enemy.getSprite().x,
                enemy.getSprite().y,
                './public/Shop/megaDiamond.png'
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
      if (
        enemy instanceof Mushroom ||
        enemy instanceof Eye ||
        enemy instanceof Skeleton
      ) {
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
