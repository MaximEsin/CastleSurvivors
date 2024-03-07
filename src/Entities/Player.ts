import * as PIXI from 'pixi.js';
import { AnimationManager } from '../GameCore/AnimationManager';
import { AudioManager } from '../GameCore/AudioManager';

export class Player extends PIXI.Container {
  private playerSprite: PIXI.AnimatedSprite;
  private isMoving: boolean = false;
  private isWalkingSoundPlaying: boolean = false;
  private isDamaged: boolean = false;
  private isDead: boolean = false;
  private health: number = 100;
  private movementTreshhold: number = 30;
  private movementSpeed: number = 5;
  private lastMeleeDamageTime: number = 0;
  private money: number = 100;
  private readonly meleeDamageCooldown: number = 1000;
  private standingAnimation: PIXI.Texture[] =
    AnimationManager.getPlayerStandingAnimation();
  private movingAnimation: PIXI.Texture[] =
    AnimationManager.getPlayerMovingAnimation();
  private hitAnimation: PIXI.Texture[] =
    AnimationManager.getPlayerDamagedAnimation();
  private deathAnimation: PIXI.Texture[] =
    AnimationManager.getPlayerDyingAnimation();

  constructor() {
    super();
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

  private playDeathSound(): void {
    AudioManager.playSound('playerDead');
  }

  public handlePlayerDefeat(): void {
    this.isDead = true;
    this.playDeathAnimation();
    this.playDeathSound();
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

  public getHealth() {
    return this.health;
  }

  public setHealth(value: number) {
    this.health = value;
  }

  public getIsDead(): boolean {
    return this.isDead;
  }

  public getLastMeleeDamageTime(): number {
    return this.lastMeleeDamageTime;
  }

  public setLastMeleeDamageTime(value: number) {
    this.lastMeleeDamageTime = value;
  }

  public getMeleeDamageCooldown(): number {
    return this.meleeDamageCooldown;
  }

  public playHitSound(): void {
    AudioManager.playSound('playerHit');
  }

  public setIsDamaged(value: boolean) {
    return (this.isDamaged = value);
  }

  private playDeathAnimation(): void {
    this.playerSprite.textures = this.deathAnimation;
    this.playerSprite.loop = false;
    this.playerSprite.play();
  }

  public updatePlayerAnimation(): void {
    if (!this.isDead) {
      if (this.isDamaged) {
        if (
          !this.playerSprite.playing ||
          this.playerSprite.textures !== this.hitAnimation
        ) {
          this.playerSprite.textures = this.hitAnimation;
          this.playerSprite.loop = false;
          this.playerSprite.onComplete = () => {
            this.isDamaged = false;
            this.playerSprite.textures = this.standingAnimation;
            this.playerSprite.loop = true;
          };
          this.playerSprite.play();
        }
      } else {
        if (this.isMoving) {
          if (
            !this.playerSprite.playing ||
            this.playerSprite.textures !== this.movingAnimation
          ) {
            this.playerSprite.textures = this.movingAnimation;
            this.playerSprite.play();
          }
        } else {
          if (
            !this.playerSprite.playing ||
            this.playerSprite.textures !== this.standingAnimation
          ) {
            this.playerSprite.textures = this.standingAnimation;
            this.playerSprite.play();
          }
        }
      }
    }
  }

  public getMoney() {
    return this.money;
  }

  public setMoney(value: number) {
    this.money = value;
  }
}
