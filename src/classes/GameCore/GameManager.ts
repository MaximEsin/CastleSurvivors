import * as PIXI from 'pixi.js';
import { Background } from '../Background';
import { PlayerInterface } from '../UI/PlayerInterface';
import { Timer } from '../UI/Timer';
import { GameEventHandler } from './GameEventHandler';
import { GameObjectManager } from './GameObjectManager';
import { WaveManager } from './WaveManager';
import { AudioManager } from '../Managers/AudioManager';

export class GameManager {
  private app: PIXI.Application;
  private backgroundLayer: PIXI.Container;
  private gameLayer: PIXI.Container;
  private interfaceLayer: PIXI.Container;
  private endScreenLayer: PIXI.Container;
  private background: Background;
  private playerInterface: PlayerInterface;
  private timer: Timer;
  private gameEventHandler: GameEventHandler;
  private gameObjectManager: GameObjectManager;
  private waveManager: WaveManager;
  private isMobile: boolean = window.innerWidth < 800;

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
    this.timer = new Timer(300);
    this.playerInterface = new PlayerInterface(this.app, this.interfaceLayer);
    this.gameEventHandler = new GameEventHandler(
      this.app,
      this.playerInterface
    );
    this.gameObjectManager = GameObjectManager.getInstance(
      this.app,
      this.playerInterface,
      this.gameLayer,
      this.endScreenLayer,
      this.timer,
      this.isMobile
    );
    this.waveManager = new WaveManager(
      this.app,
      this.gameLayer,
      this.timer,
      this.gameObjectManager,
      this.isMobile
    );

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private gameLoop(dt: number): void {
    this.updateTimer(dt);
    this.gameObjectManager.player.update(dt);

    this.gameObjectManager.updateProjectiles(dt);
    this.gameObjectManager.merchant.checkPlayerCollision(
      this.gameObjectManager.player
    );

    this.updateRenderingOrder();

    // Плохая практика. Ты каждый тик создаёшь
    // новый массив объектов (forEach создаёт новый массив)
    // и проверяешь их, не умерли ли они.
    // Хотя до этого, в том-же самом месте, наносил им урон в checkEnemyCollision
    // пусть лучше прямо там по факту произошедшего, принимается решение об удалении
    // конкретного объекта
    this.gameObjectManager.spriteCleaner();

    this.gameObjectManager.updateEnemies();

    this.gameObjectManager.removeCollectedCoins();
    this.gameObjectManager.checkCoinCollision();
    this.gameObjectManager.checkPlayerCollision();

    this.waveManager.checkForNewWave();

    this.checkForWaveCompletion();
  }

  private updateRenderingOrder(): void {
    const children = this.gameLayer.children;

    children.sort((a, b) =>
      a.y !== b.y
        ? a.y - b.y
        : this.gameLayer.getChildIndex(a) - this.gameLayer.getChildIndex(b)
    );

    children.forEach((child, index) => {
      this.gameLayer.setChildIndex(child, index);
    });
  }

  private updateTimer(dt: number): void {
    this.timer.update(dt);
    const timerString = this.timer.getTimeString();
    this.playerInterface.updateTimer(timerString);
  }

  private checkForWaveCompletion(): void {
    if (this.timer.getTime() === 0) {
      this.gameObjectManager.winScreen.showWinScreen();
    }
  }

  start(): void {
    this.gameEventHandler.setUpGlobalEventListeners();
    this.app.ticker.start();
    this.background.changeBackground();
    this.gameLayer.sortableChildren = true;
    AudioManager.initialize();
  }
}
