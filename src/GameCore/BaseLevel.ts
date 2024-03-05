import * as PIXI from 'pixi.js';
import { Background } from './Background';
import { ObjectManager } from './ObjectManager';

export class BaseLevel {
  private app: PIXI.Application;
  private objectManager: ObjectManager;
  private backgroundLayer: PIXI.Container;
  private gameLayer: PIXI.Container;
  private background: Background;

  constructor(app: PIXI.Application) {
    this.app = app;

    this.backgroundLayer = new PIXI.Container();
    this.gameLayer = new PIXI.Container();

    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.gameLayer);

    this.objectManager = new ObjectManager(this.app, this.gameLayer);

    this.background = new Background('/Backgrounds/CastleBG.webp', this.app);

    this.backgroundLayer.addChild(this.background.getSprite());

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private gameLoop() {}

  public init() {
    this.objectManager.spawnPlayer();
  }
}
