import * as PIXI from 'pixi.js';
import { EntityCreator } from '../Entities/EntityCreator';
import { InputManager } from './InputManager';

export class ObjectManager {
  private app: PIXI.Application;
  private inputManager: InputManager;
  private gameLayer: PIXI.Container;
  private entityCreator: EntityCreator;

  constructor(
    app: PIXI.Application,
    gameLayer: PIXI.Container,
    inputManager: InputManager
  ) {
    this.app = app;
    this.inputManager = inputManager;
    this.gameLayer = gameLayer;
    this.entityCreator = new EntityCreator();
  }

  public spawnPlayer() {
    const playerSprite = this.entityCreator.getPlayer().getSprite();
    playerSprite.x = this.app.screen.width / 2;
    playerSprite.y = this.app.screen.height / 2;
    this.gameLayer.addChild(playerSprite);
  }

  public handlePlayerMovement(dt: number) {
    if (this.inputManager.isPointerPressed()) {
      const mousePosition = this.inputManager.getPointerPosition();
      this.entityCreator.getPlayer().handlePlayerMovement(mousePosition, dt);
    } else {
      this.entityCreator.getPlayer().handlePlayerHalt();
    }

    this.entityCreator
      .getPlayer()
      .adjustPlayerRotation(this.inputManager.getPointerPosition().x);
  }
}
