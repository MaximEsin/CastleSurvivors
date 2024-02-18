import * as PIXI from 'pixi.js';
import { Enemy } from '../Enemies/Enemy';
import { Player } from '../Player';
import { Mushroom } from '../Enemies/Mushroom';
import { Eye } from '../Enemies/Eye';
import { Skeleton } from '../Enemies/Skeleton';
import { Coin } from '../Money/Coin';
import { Merchant } from '../Merchant';
import { DeathScreen } from '../UI/DeathScreen';
import { WinScreen } from '../UI/WinScreen';
import { AnimationManager } from '../Managers/AnimationManager';
import { InputManager } from '../Managers/InputManager';
import { PlayerInterface } from '../UI/PlayerInterface';
import { Timer } from '../UI/Timer';
import { PlayerWeaponsManager } from '../Managers/PlayerWeaponManager';

export class GameObjectManager {
  private static instance: GameObjectManager;

  private app: PIXI.Application;
  public player: Player;
  public merchant: Merchant;
  private deathScreen: DeathScreen;
  public winScreen: WinScreen;
  public animationManager: AnimationManager;
  private inputManager: InputManager;
  private timer: Timer;
  private playerInterface: PlayerInterface;
  private playerWeaponsManager: PlayerWeaponsManager;
  private gameLayer: PIXI.Container;
  private endScreenLayer: PIXI.Container;
  public enemies: Enemy[] = [];
  public coins: Coin[] = [];
  private currentWave: number = 0;

  constructor(
    app: PIXI.Application,
    playerInterface: PlayerInterface,
    gameLayer: PIXI.Container,
    endScreenLayer: PIXI.Container,
    timer: Timer
  ) {
    this.app = app;
    this.playerInterface = playerInterface;
    this.gameLayer = gameLayer;
    this.endScreenLayer = endScreenLayer;
    this.timer = timer;
    this.animationManager = new AnimationManager();
    this.inputManager = new InputManager();
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
      this.playerInterface,
      this.deathScreen,
      this.gameLayer
    );
    this.playerWeaponsManager = new PlayerWeaponsManager(
      this.app,
      this.gameLayer,
      this.player,
      this.playerInterface
    );
    this.merchant = new Merchant(
      this.app,
      this.gameLayer,
      this.animationManager,
      this.playerInterface,
      this.playerWeaponsManager
    );
  }

  public static getInstance(
    app: PIXI.Application,
    playerInterface: PlayerInterface,
    gameLayer: PIXI.Container,
    endScreenLayer: PIXI.Container,
    timer: Timer
  ): GameObjectManager {
    if (!GameObjectManager.instance) {
      GameObjectManager.instance = new GameObjectManager(
        app,
        playerInterface,
        gameLayer,
        endScreenLayer,
        timer
      );
    }
    return GameObjectManager.instance;
  }

  updateEnemies(): void {
    for (const enemy of this.enemies) {
      if (!enemy.getDeathState()) {
        enemy.update();
      }

      this.player.checkProjectileCollision(enemy.getProjectiles());
    }
  }

  updateProjectiles(): void {
    this.playerWeaponsManager.update(this.enemies);
    const playerKnives = this.playerWeaponsManager.getKnives();
    const playerCursedEyes = this.playerWeaponsManager.getEyes();
    const playerKebabs = this.playerWeaponsManager.getKebabs();
    const playerProjectiles = [
      ...playerKnives,
      ...playerCursedEyes,
      ...playerKebabs,
    ];

    playerProjectiles.forEach((projectile) => {
      for (const enemy of this.enemies) {
        const deathState = enemy.getDeathState();
        if (deathState) {
          if (
            enemy instanceof Mushroom ||
            enemy instanceof Eye ||
            enemy instanceof Skeleton
          ) {
            const coin = enemy.spawnCoin();
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

  public checkCoinCollision(): void {
    const playerBounds = this.player.getSprite().getBounds();
    for (const coin of this.coins) {
      const coinBounds = coin.getSprite().getBounds();

      if (playerBounds.intersects(coinBounds)) {
        if (!coin.getIsCollected()) {
          const value = coin.coinPoints;
          coin.collect();
          this.playerInterface.updateCoinCount(value);
        }
      }
    }
  }

  checkPlayerCollision(): void {
    const playerBounds = this.player.getSprite().getBounds();

    for (const enemy of this.enemies) {
      const enemyBounds = enemy.getSprite().getBounds();

      if (playerBounds.intersects(enemyBounds)) {
        this.player.receiveDamage(5, true);
      }
    }
  }

  private removeEnemies(): void {
    for (const enemy of this.enemies) {
      this.gameLayer.removeChild(enemy.getSprite());
      enemy.projectiles.forEach((projectile) => projectile.destroy());
      enemy.projectiles = [];
      enemy.destroy();
    }
    this.enemies = [];
  }

  private removeCoins(): void {
    for (const coin of this.coins) {
      this.gameLayer.removeChild(coin.getSprite());
    }
    this.coins = [];
  }

  spriteCleaner() {
    this.enemies.forEach((enemy) => {
      if (enemy.isDead) {
        this.gameLayer.removeChild(enemy.getSprite());
      }
    });
  }

  removeCollectedCoins() {
    this.coins.forEach((coin) => {
      if (coin.getIsCollected()) {
        const index = this.coins.indexOf(coin);
        this.coins.splice(index, 1);
        this.gameLayer.removeChild(coin.getSprite());
      }
    });
  }

  getCurrentWave() {
    return this.currentWave;
  }

  incrementCurrentWave() {
    this.currentWave++;
  }

  resetGame(): void {
    this.app.ticker.stop();

    this.removeEnemies();

    this.removeCoins();

    this.player.resetPlayer();

    this.playerInterface.resetCoins();

    this.currentWave = 0;

    this.timer.resetTimer();

    this.app.ticker.start();
  }
}
