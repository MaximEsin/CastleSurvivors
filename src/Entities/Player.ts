import * as PIXI from 'pixi.js';
import { AnimationManager } from '../GameCore/AnimationManager';
import { AudioManager } from '../GameCore/AudioManager';

export class Player {
  private playerSprite: PIXI.AnimatedSprite;
  private isMoving: boolean = false;
  private isWalkingSoundPlaying: boolean = false;
  private movementTreshhold: number = 30;
  private movementSpeed: number = 5;

  constructor() {
    this.playerSprite = this.createPlayer();
  }

  private createPlayer() {
    const playerTextures = AnimationManager.getPlayerStandingAnimation();
    const animation = new PIXI.AnimatedSprite(playerTextures);
    animation.anchor.set(0.5);
    animation.animationSpeed = 0.1;
    animation.play();
    return animation;
  }

  private playMovingSound() {
    AudioManager.playSoundWithLoop('walkingSound', true);
    AudioManager.setVolume('walkingSound', 0.5);
  }

  public handlePlayerMovement(
    mousePosition: { x: number; y: number },
    dt: number
  ): void {
    const playerPosition = this.playerSprite.position;
    const dx = mousePosition.x - playerPosition.x;
    const dy = mousePosition.y - playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.movementTreshhold) {
      this.isMoving = true;

      if (!this.isWalkingSoundPlaying) {
        this.playMovingSound();
        this.isWalkingSoundPlaying = true;
      }

      const directionX = dx / distance;
      const directionY = dy / distance;

      playerPosition.x += directionX * this.movementSpeed * dt;
      playerPosition.y += directionY * this.movementSpeed * dt;

      this.playerSprite.rotation = Math.atan2(dy, dx);

      this.playerSprite.zIndex = this.playerSprite.y;
    }

    if (distance < this.movementTreshhold) {
      this.handlePlayerHalt();
    }
  }

  public handlePlayerHalt(): void {
    this.isMoving = false;
    this.isWalkingSoundPlaying = false;
    AudioManager.stopSound('walkingSound');
  }

  public adjustPlayerRotation(pointerX: number): void {
    const playerX = this.playerSprite.x;

    const dx = pointerX - playerX;

    if (dx < 0) {
      this.playerSprite.scale.x = -1;
    } else {
      this.playerSprite.scale.x = 1;
    }

    this.playerSprite.rotation = 0;
  }

  public getSprite() {
    return this.playerSprite;
  }
}
