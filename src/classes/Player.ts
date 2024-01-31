import * as PIXI from 'pixi.js';
import { AnimationManager } from './AnimationManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { Projectile } from './Projectile';
import { PlayerInterface } from './PlayerInterface';

export class Player {
  private app: PIXI.Application;
  private animationManager: AnimationManager;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private playerSprite: PIXI.AnimatedSprite;
  private playerStandingTextures: PIXI.Texture[];
  private playerMovingTextures: PIXI.Texture[];
  private health: number;
  private playerInterface: PlayerInterface;

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    inputManager: InputManager,
    audioManager: AudioManager,
    playerInterface: PlayerInterface
  ) {
    this.animationManager = animationManager;
    this.inputManager = inputManager;
    this.audioManager = audioManager;
    this.app = app;
    this.health = 100;
    this.playerInterface = playerInterface;
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
    animation.animationSpeed = 0.1;
    animation.play();

    this.app.stage.addChild(animation);

    return animation;
  }

  public moveUp(): void {
    this.playerSprite.y -= 5;
    this.playMovingSound();
  }

  public moveDown(): void {
    this.playerSprite.y += 5;
    this.playMovingSound();
  }

  public moveLeft(): void {
    this.playerSprite.x -= 5;
    this.playerSprite.scale.x = -1;
    this.playMovingSound();
  }

  public moveRight(): void {
    this.playerSprite.x += 5;
    this.playerSprite.scale.x = 1;
    this.playMovingSound();
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

    this.handleBorderWrap();
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

  private handleBorderWrap(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height * 0.8;

    // Check and handle border wrap-around horizontally
    if (this.playerSprite.x < 0) {
      this.playerSprite.x = screenWidth;
    } else if (this.playerSprite.x > screenWidth) {
      this.playerSprite.x = 0;
    }

    // Check and handle border wrap-around vertically
    if (this.playerSprite.y < 0) {
      this.playerSprite.y = screenHeight;
    } else if (this.playerSprite.y > screenHeight) {
      this.playerSprite.y = 0;
    }
  }

  playMovingSound() {
    this.audioManager.playSound('walkingSound');
    this.audioManager.setVolume('walkingSound', 0.5);
  }

  checkProjectileCollision(projectiles: Projectile[]): void {
    for (const projectile of projectiles) {
      if (
        this.playerSprite
          .getBounds()
          .contains(projectile.getSprite().x, projectile.getSprite().y)
      ) {
        this.receiveDamage(projectile.damage);
        projectile.destroy();
      }
    }
  }

  private receiveDamage(damage: number): void {
    this.health -= damage;

    this.playerInterface.updateHealthText(this.health);
  }
}
