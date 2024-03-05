import * as PIXI from 'pixi.js';
import { Background } from './Background';
import { ObjectManager } from './ObjectManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';

export class BaseLevel {
  private app: PIXI.Application;
  private objectManager: ObjectManager;
  private inputManager: InputManager;
  private backgroundLayer: PIXI.Container;
  private gameLayer: PIXI.Container;
  private background: Background;

  constructor(app: PIXI.Application) {
    this.app = app;

    this.backgroundLayer = new PIXI.Container();
    this.gameLayer = new PIXI.Container();

    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.gameLayer);

    this.inputManager = new InputManager();
    this.objectManager = new ObjectManager(
      this.app,
      this.gameLayer,
      this.inputManager
    );

    this.background = new Background('/Backgrounds/CastleBG.webp', this.app);

    this.backgroundLayer.addChild(this.background.getSprite());

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private gameLoop(dt: number) {
    // Player
    this.objectManager.handlePlayerMovement(dt);
    this.objectManager.handlePlayerBorderWrap();
  }

  public init() {
    AudioManager.initialize();
    this.objectManager.spawnPlayer();
  }
}
