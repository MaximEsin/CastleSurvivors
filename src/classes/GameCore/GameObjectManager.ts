import * as PIXI from 'pixi.js';
import { Enemy, LootType } from '../Enemies/Enemy';
import { Player } from '../Player';
import { Coin } from '../Money/Coin';
import { Diamond } from '../Money/Diamond';
import { MegaDiamond } from '../Money/MegaDiamond';
import { Merchant } from '../Merchant';
import { DeathScreen } from '../UI/DeathScreen';
import { WinScreen } from '../UI/WinScreen';
import { AnimationManager } from '../Managers/AnimationManager';
import { InputManager } from '../Managers/InputManager';
import { PlayerInterface } from '../UI/PlayerInterface';
import { Timer } from '../UI/Timer';
import { PlayerWeaponsManager } from '../Managers/PlayerWeaponManager';

export class GameObjectManager {
  //Смотри, её лучше переименовать в _instance
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
  private isMobile: boolean;

  constructor(
    app: PIXI.Application,
    playerInterface: PlayerInterface,
    gameLayer: PIXI.Container,
    endScreenLayer: PIXI.Container,
    timer: Timer,
    isMobile: boolean
  ) {
    // Затем вот тут this._instance = this;

    this.app = app;
    this.playerInterface = playerInterface;
    this.gameLayer = gameLayer;
    this.endScreenLayer = endScreenLayer;
    this.timer = timer;
    this.isMobile = isMobile;
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
      this.gameLayer,
      this.isMobile
    );
    this.playerWeaponsManager = new PlayerWeaponsManager(
      this.app,
      this.gameLayer,
      this.player,
      this.playerInterface,
      this.isMobile
    );
    this.merchant = new Merchant(
      this.app,
      this.gameLayer,
      this.animationManager,
      this.playerInterface,
      this.playerWeaponsManager,
      this.isMobile
    );
  }

  // А вот тут вместо того, чтобы повторять функционал конструктора
  // лучше просто вернуть this._instance
  // а само название функции переделать в
  // public static get instance
  // и получать экземпляр как GameObjectManager.instance
  public static getInstance(
    app: PIXI.Application,
    playerInterface: PlayerInterface,
    gameLayer: PIXI.Container,
    endScreenLayer: PIXI.Container,
    timer: Timer,
    isMobile: boolean
  ): GameObjectManager {
    if (!GameObjectManager.instance) {
      GameObjectManager.instance = new GameObjectManager(
        app,
        playerInterface,
        gameLayer,
        endScreenLayer,
        timer,
        isMobile
      );
    }
    return GameObjectManager.instance;
  }

  updateEnemies(): void {
    for (const enemy of this.enemies) {
      if (!enemy.getDeathState()) {
        enemy.update(this.player);
      }

      this.player.checkProjectileCollision(enemy.getProjectiles());
    }
  }

  updateProjectiles(dt: number): void {
    this.playerWeaponsManager.update(this.enemies, dt);
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
          const coin = this.createLoot(enemy.lootType, enemy);
          if (coin) this.coins.push(coin);

          this.spriteCleaner();
        }
        if (!deathState) {
          // Смотри, у тебя функция называется ЧЕК, но на самом деле ты чекаешь коллизию
          // И наносишь урон И проверяешь, не умер ли враг.
          // Лучше отдельно чекать коллизию и возвращать результат сюда-же в иф
          // А потом тут внутри ифа, наносить урон и опять-же, возвращать результат
          // Ииии, если у врага здоровье меньше или равно нулю, делать с ним всякие действия
          projectile.checkEnemyCollision(this.enemies);
        }
      }
    });
  }

  private createLoot(lootType: LootType, enemy: Enemy) {
    switch (lootType) {
      case LootType.Coin: {
        return new Coin(
          enemy.getSprite().x,
          enemy.getSprite().y,
          '/Shop/coin.png',
          this.gameLayer,
          this.isMobile
        );
      }
      case LootType.Diamond: {
        return new Diamond(
          enemy.getSprite().x,
          enemy.getSprite().y,
          '/Shop/diamond.png',
          this.gameLayer,
          this.isMobile
        );
      }
      case LootType.MegaDiamond: {
        return new MegaDiamond(
          enemy.getSprite().x,
          enemy.getSprite().y,
          '/Shop/megaDiamond.png',
          this.gameLayer,
          this.isMobile
        );
      }
    }
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

      this.removeCollectedCoins();
    }
  }

  checkPlayerCollision(): void {
    const playerBounds = this.player.getSprite().getBounds();

    for (const enemy of this.enemies) {
      const enemyBounds = enemy.getSprite().getBounds();

      if (playerBounds.intersects(enemyBounds)) {
        this.player.receiveDamage(enemy.meleeDamage, true);
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
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.isDead) {
        this.gameLayer.removeChild(enemy.getSprite());
        return false;
      }
      return true;
    });
  }

  removeCollectedCoins() {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];

      if (coin.getIsCollected()) {
        this.coins.splice(i, 1);

        this.gameLayer.removeChild(coin.getSprite());
      }
    }
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
