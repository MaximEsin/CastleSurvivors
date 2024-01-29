import * as PIXI from 'pixi.js';
import { AnimationManager } from './AnimationManager';
import { InputManager } from './InputManager';

export class Player {
  private app: PIXI.Application;
  private animationManager: AnimationManager;
  private inputManager: InputManager;
  private playerSprite: PIXI.AnimatedSprite;
  private playerStandingTextures: PIXI.Texture[];
  private playerMovingTextures: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    inputManager: InputManager
  ) {
    this.animationManager = animationManager;
    this.inputManager = inputManager;
    this.app = app;
    this.playerSprite = this.createPlayerSprite();
    this.playerStandingTextures =
      this.animationManager.getPlayerStandingAnimation();
    this.playerMovingTextures =
      this.animationManager.getPlayerMovingAnimation();
  }

  private createPlayerSprite(): PIXI.AnimatedSprite {
    const playerTextures = this.animationManager.getPlayerStandingAnimation();
    const animation = new PIXI.AnimatedSprite(playerTextures);
    animation.x = window.innerWidth / 2 - 100;
    animation.y = window.innerHeight / 2 - 100;
    animation.animationSpeed = 0.2;
    animation.play();

    this.app.stage.addChild(animation);

    return animation;
  }

  public moveUp(): void {
    this.playerSprite.y -= 5;
  }

  public moveDown(): void {
    this.playerSprite.y += 5;
  }

  public moveLeft(): void {
    this.playerSprite.x -= 5;
  }

  public moveRight(): void {
    this.playerSprite.x += 5;
  }

  public handlePlayerMovement(): void {
    if (this.inputManager.isKeyPressed('w')) {
      this.moveUp();
    } else if (this.inputManager.isKeyPressed('s')) {
      this.moveDown();
    }

    if (this.inputManager.isKeyPressed('a')) {
      this.moveLeft();
    } else if (this.inputManager.isKeyPressed('d')) {
      this.moveRight();
    }
  }

  public updatePlayerAnimation(): void {
    if (
      this.inputManager.isKeyPressed('w') ||
      this.inputManager.isKeyPressed('a') ||
      this.inputManager.isKeyPressed('s') ||
      this.inputManager.isKeyPressed('d')
    ) {
      if (
        !this.playerSprite.playing ||
        this.playerSprite.textures !== this.playerMovingTextures
      ) {
        this.playerSprite.textures = this.playerMovingTextures;
        this.playerSprite.play();
      }
    } else {
      if (
        !this.playerSprite.playing ||
        this.playerSprite.textures !== this.playerStandingTextures
      ) {
        this.playerSprite.textures = this.playerStandingTextures;
        this.playerSprite.play();
      }
    }
  }
}
