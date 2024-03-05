import * as PIXI from 'pixi.js';
import { Background } from './Background';
import { ObjectManager } from './ObjectManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { Interface } from '../UI/Interface';
import { EventHandler } from './EventHandler';

export class BaseLevel {
  private app: PIXI.Application;
  private interface: Interface;
  private objectManager: ObjectManager;
  private inputManager: InputManager;
  private eventHandler: EventHandler;
  private backgroundLayer: PIXI.Container;
  private gameLayer: PIXI.Container;
  private interfaceLayer: PIXI.Container;
  private background: Background;

  constructor(app: PIXI.Application) {
    this.app = app;

    this.backgroundLayer = new PIXI.Container();
    this.gameLayer = new PIXI.Container();
    this.interfaceLayer = new PIXI.Container();

    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.gameLayer);
    this.app.stage.addChild(this.interfaceLayer);

    this.interface = new Interface(this.app);
    this.inputManager = new InputManager();
    this.eventHandler = new EventHandler(this.app);
    this.objectManager = new ObjectManager(
      this.app,
      this.gameLayer,
      this.inputManager
    );

    this.background = new Background('/Backgrounds/CastleBG.webp', this.app);

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private gameLoop(dt: number) {
    // Player
    this.objectManager.handlePlayerMovement(dt);
    this.objectManager.handlePlayerBorderWrap();
  }

  public canPlayerAfford(cost: number) {
    if (cost <= this.interface.getCoinCount()) {
      return true;
    }

    return false;
  }

  public init() {
    this.backgroundLayer.addChild(this.background.getSprite());
    this.interfaceLayer.addChild(
      this.interface.getBackgroundSprite(),
      this.interface.getCenterContainer()
    );
    this.interfaceLayer.addChild(this.interface.getTimerText());
    AudioManager.initialize();
    this.eventHandler.setUpGlobalEventListeners(this.interface);
    this.objectManager.spawnPlayer();
  }
}
