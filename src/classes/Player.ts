import * as PIXI from 'pixi.js';
import { AnimationManager } from './Managers/AnimationManager';
import { InputManager } from './Managers/InputManager';
import { AudioManager } from './Managers/AudioManager';
import { Projectile } from './Projectile';
import { PlayerInterface } from './UI/PlayerInterface';
import { DeathScreen } from './UI/DeathScreen';

export class Player extends PIXI.Container {
  private app: PIXI.Application;
  private animationManager: AnimationManager;
  private inputManager: InputManager;
  private playerSprite: PIXI.AnimatedSprite;
  private playerStandingTextures: PIXI.Texture[];
  private playerMovingTextures: PIXI.Texture[];
  private playerDamagedTextures: PIXI.Texture[];
  private playerInterface: PlayerInterface;
  private deathScreen: DeathScreen;
  public health: number = 100;
  private layer: PIXI.Container<PIXI.DisplayObject>;
  private isDamaged: boolean = false;
  private isMoving: boolean = false;
  private isWalkingSoundPlaying: boolean = false;
  private movementTreshhold: number = 30;
  private movementSpeed: number = 5;
  private ZIndex: number = 100;
  private lastEnemyDamageTime: number = 0;
  private readonly enemyDamageCooldown: number = 1000;
  private isDead: boolean = false;
  private isMobile: boolean;

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    inputManager: InputManager,
    playerInterface: PlayerInterface,
    deathScreen: DeathScreen,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super();
    this.animationManager = animationManager;
    this.inputManager = inputManager;
    this.app = app;
    this.layer = layer;
    this.isMobile = isMobile;
    this.playerInterface = playerInterface;
    this.playerSprite = this.createPlayerSprite();
    this.playerStandingTextures =
      this.animationManager.getPlayerStandingAnimation();
    this.playerMovingTextures =
      this.animationManager.getPlayerMovingAnimation();
    this.playerDamagedTextures =
      this.animationManager.getPlayerDamagedAnimation();
    this.deathScreen = deathScreen;
  }

  private createPlayerSprite(): PIXI.AnimatedSprite {
    const playerTextures = this.animationManager.getPlayerStandingAnimation();
    const animation = new PIXI.AnimatedSprite(playerTextures);

    if (this.isMobile) {
      animation.scale.set(0.5);
    }

    animation.x = window.innerWidth / 2 - 100;
    animation.y = window.innerHeight / 2 - 100;
    animation.anchor.set(0.5);
    animation.animationSpeed = 0.1;
    animation.play();

    this.layer.addChild(animation);

    return animation;
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

      this.playerSprite.zIndex = this.ZIndex;
    }

    if (distance < this.movementTreshhold) {
      this.handlePlayerHalt();
    }
  }

  private handlePlayerHalt(): void {
    this.isMoving = false;
    this.isWalkingSoundPlaying = false;
    AudioManager.stopSound('walkingSound');
  }

  private adjustPlayerRotation(): void {
    const mouseX = this.inputManager.getPointerPosition().x;
    const playerX = this.playerSprite.x;

    const dx = mouseX - playerX;

    if (dx < 0) {
      this.playerSprite.scale.x = -1;
    } else {
      this.playerSprite.scale.x = 1;
    }

    this.playerSprite.rotation = 0;
  }

  public updatePlayerAnimation(): void {
    if (this.isDamaged) {
      if (
        !this.playerSprite.playing ||
        this.playerSprite.textures !== this.playerDamagedTextures
      ) {
        this.playerSprite.textures = this.playerDamagedTextures;
        this.playerSprite.loop = false;
        this.playerSprite.onComplete = () => {
          this.isDamaged = false;
          this.playerSprite.textures = this.playerStandingTextures;
          this.playerSprite.loop = true;
        };
        this.playerSprite.play();
      }
    } else {
      if (this.isMoving) {
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

  private playMovingSound() {
    AudioManager.playSoundWithLoop('walkingSound', true);
    AudioManager.setVolume('walkingSound', 0.5);
  }

  private playHitSound(): void {
    AudioManager.playSound('playerHit');
  }

  private playDeathSound(): void {
    AudioManager.playSound('playerDead');
  }

  public checkProjectileCollision(projectiles: Projectile[]): void {
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

  public receiveDamage(
    damage: number,
    isEnemyCollision: boolean = false
  ): void {
    const currentTime = Date.now();
    if (isEnemyCollision) {
      const timeSinceLastDamage = currentTime - this.lastEnemyDamageTime;
      if (timeSinceLastDamage < this.enemyDamageCooldown) {
        return;
      }
      this.lastEnemyDamageTime = currentTime;
    }

    if (!this.isDead) {
      this.health -= damage;
      this.isDamaged = true;

      this.playHitSound();

      this.playerInterface.updateHealthText(this.health);

      if (this.health <= 0) {
        this.isDead = true;
        this.handlePlayerDefeat();
      }
    }
  }

  private handlePlayerDefeat(): void {
    this.playDeathAnimation();

    this.playDeathSound();

    setTimeout(() => {
      this.deathScreen.showDeathScreen();
    }, 900);
  }

  private playDeathAnimation(): void {
    const deathTextures = this.animationManager.getPlayerDyingAnimation();
    const deathAnimation = new PIXI.AnimatedSprite(deathTextures);

    if (this.isMobile) {
      deathAnimation.scale.set(0.6);
    }

    this.layer.removeChild(this.playerSprite);
    deathAnimation.x = this.playerSprite.x;
    deathAnimation.y = this.playerSprite.y;
    deathAnimation.anchor.set(0.5);
    deathAnimation.animationSpeed = 0.1;
    deathAnimation.loop = false;
    deathAnimation.play();

    this.layer.addChild(deathAnimation);
  }

  public resetPlayer(): void {
    this.isDead = false;
    this.layer.removeChild(this.playerSprite);

    this.playerSprite = this.createPlayerSprite();

    this.health = 100;
    this.isDamaged = false;
    this.playerInterface.updateHealthText(this.health);
  }

  public getSprite() {
    return this.playerSprite;
  }

  public getBounds() {
    return this.playerSprite.getBounds();
  }

  update(dt: number) {
    if (this.inputManager.isPointerPressed()) {
      const mousePosition = this.inputManager.getPointerPosition();
      this.handlePlayerMovement(mousePosition, dt);
    } else {
      this.handlePlayerHalt();
    }

    this.handleBorderWrap();
    this.adjustPlayerRotation();
    this.updatePlayerAnimation();
  }
}
