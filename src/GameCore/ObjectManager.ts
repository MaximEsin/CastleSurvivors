import * as PIXI from 'pixi.js';
import { Player } from '../Entities/Player';
import { InputManager } from './InputManager';
import { Enemy } from '../Entities/Enemy';
import { EnemyType } from '../Enums/EnemyType';

export class ObjectManager {
  private app: PIXI.Application;
  private inputManager: InputManager;
  private gameLayer: PIXI.Container;
  private player: Player;
  private enemies: Enemy[] = [];
  private interfaceSizeMultiplier: number = 0.8;

  constructor(
    app: PIXI.Application,
    gameLayer: PIXI.Container,
    inputManager: InputManager
  ) {
    this.app = app;
    this.inputManager = inputManager;
    this.gameLayer = gameLayer;
    this.player = new Player();
  }

  public spawnPlayer() {
    const playerSprite = this.player.getSprite();
    playerSprite.x = this.app.screen.width / 2;
    playerSprite.y = this.app.screen.height / 2;
    this.gameLayer.addChild(playerSprite);
  }

  public handlePlayerMovement(dt: number) {
    if (this.inputManager.isPointerPressed()) {
      const mousePosition = this.inputManager.getPointerPosition();
      this.player.handlePlayerMovement(mousePosition, dt);
    } else {
      this.player.handlePlayerHalt();
    }

    this.player.adjustPlayerRotation(this.inputManager.getPointerPosition().x);
  }

  public handlePlayerBorderWrap(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height * this.interfaceSizeMultiplier;
    const playerSprite = this.player.getSprite();

    if (playerSprite.x < 20) {
      playerSprite.x = screenWidth;
    } else if (playerSprite.x > screenWidth) {
      playerSprite.x = 20;
    }

    if (playerSprite.y < 20) {
      playerSprite.y = screenHeight;
    } else if (playerSprite.y > screenHeight) {
      playerSprite.y = 20;
    }
  }

  public spawnEnemies() {
    const enemy = new Enemy(EnemyType.Mushroom);
    this.enemies.push(enemy);
    enemy.setRandomPosition(this.app, enemy.getSprite());

    this.gameLayer.addChild(enemy.getSprite());
  }

  public handleEnemyMovement() {
    this.enemies.forEach((enemy) => {
      enemy.moveToPlayer(this.player);
    });
  }
}
