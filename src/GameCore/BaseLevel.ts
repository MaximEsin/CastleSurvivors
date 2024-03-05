import * as PIXI from 'pixi.js';
import { Background } from './Background';
import { ObjectManager } from './ObjectManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { Interface } from '../UI/Interface';
import { EventHandler } from './EventHandler';
import { ScreenManager } from './ScreenManager';
import { ScreenType } from '../Enums/ScreenType';

export class BaseLevel {
  private app: PIXI.Application;
  private interface: Interface;
  private objectManager: ObjectManager;
  private inputManager: InputManager;
  private eventHandler: EventHandler;
  private screenManager: ScreenManager;
  private backgroundLayer: PIXI.Container;
  private gameLayer: PIXI.Container;
  private interfaceLayer: PIXI.Container;
  private screenLayer: PIXI.Container;
  private background: Background;

  constructor(app: PIXI.Application) {
    this.app = app;

    this.backgroundLayer = new PIXI.Container();
    this.gameLayer = new PIXI.Container();
    this.interfaceLayer = new PIXI.Container();
    this.screenLayer = new PIXI.Container();

    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.gameLayer);
    this.app.stage.addChild(this.interfaceLayer);
    this.app.stage.addChild(this.screenLayer);

    this.interface = new Interface(this.app);
    this.inputManager = new InputManager();
    this.eventHandler = new EventHandler(this.app);
    this.screenManager = new ScreenManager(this.app, this.screenLayer);
    this.objectManager = new ObjectManager(
      this.app,
      this.gameLayer,
      this.inputManager
    );

    this.background = new Background('/Backgrounds/CastleBG.webp', this.app);

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private handleDeathScreenDisplay() {
    if (
      this.objectManager.getPlayer().getIsDead() &&
      !this.screenManager.getIsScreenDisplayed()
    ) {
      setTimeout(() => {
        this.screenManager.showScreen(ScreenType.Death);
      }, 500);
    }
  }

  private handleGameReset() {
    if (this.screenManager.getIsPressed()) {
      this.objectManager.resetEntities();
      this.screenManager.hideScreen();
    }
  }

  private gameLoop(dt: number) {
    // Player
    this.objectManager.handlePlayerMovement(dt);
    this.objectManager.handlePlayerBorderWrap();
    this.objectManager.handlePlayerAnimationUpdate();
    this.objectManager.handlePlayerDeath();

    this.objectManager.handleEnemyMovement();
    this.objectManager.handleMeleeDamageDealing();

    this.interface.updateHealthText(this.objectManager.getPlayer().getHealth());
    this.handleDeathScreenDisplay();
    this.handleGameReset();
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
    this.objectManager.spawnEnemies();
  }
}
