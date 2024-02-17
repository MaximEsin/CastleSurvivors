import * as PIXI from 'pixi.js';
import { Background } from '../Background';
import { AudioManager } from '../Managers/AudioManager';
import { PlayerInterface } from '../UI/PlayerInterface';
import { Timer } from '../UI/Timer';
import { GameEventHandler } from './GameEventHandler';
import { GameObjectManager } from './GameObjectManager';
import { WaveManager } from './WaveManager';

export class GameManager {
  private app: PIXI.Application;
  private backgroundLayer: PIXI.Container;
  private gameLayer: PIXI.Container;
  private interfaceLayer: PIXI.Container;
  private endScreenLayer: PIXI.Container;
  private background: Background;
  private audioManager: AudioManager;
  private playerInterface: PlayerInterface;
  private timer: Timer;
  private gameEventHandler: GameEventHandler;
  private gameObjectManager: GameObjectManager;
  private waveManager: WaveManager;

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
    this.audioManager = new AudioManager();
    this.timer = new Timer(300);
    this.playerInterface = new PlayerInterface(this.app, this.interfaceLayer);
    this.gameEventHandler = new GameEventHandler(
      this.app,
      this.playerInterface,
      this.audioManager
    );
    this.gameObjectManager = new GameObjectManager(
      this.app,
      this.audioManager,
      this.playerInterface,
      this.gameLayer,
      this.endScreenLayer,
      this.timer
    );
    this.waveManager = new WaveManager(
      this.app,
      this.gameLayer,
      this.timer,
      this.gameObjectManager
    );

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  // на самом деле, dt вполне подойдёт для наименования
  // это устойчивый нейминг
  private gameLoop(deltaMS: number): void {
    this.updateTimer(deltaMS);
    this.gameObjectManager.player.update(this.gameObjectManager.coins);

    this.gameObjectManager.updateProjectiles();
    this.gameObjectManager.merchant.checkPlayerCollision(
      this.gameObjectManager.player
    );

    this.updateRenderingOrder();
    this.gameObjectManager.spriteCleaner();

    this.gameObjectManager.updateEnemies();

    this.waveManager.checkForNewWave();

    this.checkForWaveCompletion();
  }

  private updateRenderingOrder(): void {
    this.gameObjectManager.enemies.sort(
      (a, b) => a.getSprite().y - b.getSprite().y
    );

    // Достаточно устновить в ините
    this.gameLayer.sortableChildren = true;

    // Почему ты добавляешь персонажа адчайлдом в самый верх каждый тик?
    // sortableChildren по идее и так сортирует их на основе z-индекса
    // а вот уже этот индекс как раз нужно указывать вручную. 
    // Я бы указывал его в том месте, где происходит перемещение объектов.
    // Там-же можно устанавливать его для игрока.
    this.gameLayer.addChild(this.gameObjectManager.player.getSprite());

    // Зачем класть бэкграунд на самый низ? У нас на слое backgroundLayer находятся какие-то
    // другие объекты?
    this.backgroundLayer.addChildAt(this.background.getSprite(), 0);

    // По идее, (если не путаю), парамтер sortableChildren как раз отвечает за вызов
    // sortChildren
    this.gameLayer.sortChildren();
  }

  private updateTimer(deltaMS: number): void {
    this.timer.update(deltaMS);
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
  }
}
