import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Projectile } from '../Projectile';

export class Enemy extends PIXI.Container {
  protected app: PIXI.Application;
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  protected animationManager: AnimationManager;
  protected enemySprite: PIXI.AnimatedSprite;
  protected direction: PIXI.Point = new PIXI.Point(1, 1);
  protected throwTimer: number = 0;
  protected throwInterval: number = Math.floor(Math.random() * 4000) + 5000;
  public projectiles: Projectile[] = [];
  protected health: number;
  private isHit: boolean = false;
  public isDead: boolean = false;

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    health: number,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    super();
    this.animationManager = animationManager;
    this.app = app;
    this.layer = layer;
    this.health = health;
    this.enemySprite = this.createEnemySprite();
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    throw new Error('createEnemySprite must be implemented in derived classes');
  }

  protected setRandomPosition(animation: PIXI.AnimatedSprite): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    const borderOffset = -150;

    // Randomly choose whether to spawn near the horizontal or vertical border
    const spawnNearHorizontal = Math.random() < 0.5;

    if (spawnNearHorizontal) {
      // Spawn near the left or right border
      const spawnOnLeft = Math.random() < 0.5;
      animation.x = spawnOnLeft
        ? Math.max(0, -borderOffset) // Ensure enemy stays inside left border
        : Math.min(screenWidth, screenWidth + borderOffset); // Ensure enemy stays inside right border

      animation.y = Math.random() * screenHeight;
    } else {
      // Spawn near the top or bottom border
      const spawnOnTop = Math.random() < 0.5;
      animation.x = Math.random() * screenWidth;
      animation.y = spawnOnTop
        ? Math.max(0, -borderOffset) // Ensure enemy stays inside top border
        : Math.min(screenHeight, screenHeight + borderOffset); // Ensure enemy stays inside bottom border
    }
  }

  protected moveRandomly(): void {
    const speed = 2;

    // Move the enemy in the current direction
    this.enemySprite.x += this.direction.x * speed;
    this.enemySprite.y += this.direction.y * speed;

    this.adjustEnemyRotation();

    this.handleBorderWrap();
  }

  protected adjustEnemyRotation(): void {
    if (this.direction.x !== 0 && this.direction.y !== 0) {
      if (this.direction.x > 0) {
        this.enemySprite.scale.x = 1;
      } else {
        this.enemySprite.scale.x = -1;
      }
    } else {
      this.enemySprite.scale.x = 1;
    }
    this.enemySprite.rotation = 0;
  }

  protected handleBorderWrap(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height * 0.8;

    // Check and handle border wrap-around horizontally
    if (this.enemySprite.x < 0) {
      // Invert the x direction
      this.direction.x *= -1;
      // Place the enemy inside the screen borders
      this.enemySprite.x = 0;
    } else if (this.enemySprite.x > screenWidth) {
      // Invert the x direction
      this.direction.x *= -1;
      // Place the enemy inside the screen borders
      this.enemySprite.x = screenWidth;
    }

    // Check and handle border wrap-around vertically
    if (this.enemySprite.y < 0) {
      // Invert the y direction
      this.direction.y *= -1;
      // Place the enemy inside the screen borders
      this.enemySprite.y = 0;
    } else if (this.enemySprite.y > screenHeight) {
      // Invert the y direction
      this.direction.y *= -1;
      // Place the enemy inside the screen borders
      this.enemySprite.y = screenHeight;
    }
  }

  protected updateAnimation(
    standingFrames: PIXI.Texture[],
    movingFrames: PIXI.Texture[],
    damagedFrames: PIXI.Texture[]
  ): void {
    if (this.isHit) {
      // Play damaged animation once
      if (
        !this.enemySprite.playing ||
        this.enemySprite.textures !== damagedFrames
      ) {
        this.enemySprite.textures = damagedFrames;
        this.enemySprite.loop = false;
        this.enemySprite.onComplete = () => {
          this.isHit = false;
          this.enemySprite.textures = movingFrames;
          this.enemySprite.loop = true;
        };
        this.enemySprite.play();
      }
    } else {
      if (
        this.direction.x !== 0 || // Moving horizontally
        this.direction.y !== 0 // Moving vertically
      ) {
        // Switch to moving animation
        if (
          !this.enemySprite.playing ||
          this.enemySprite.textures !== movingFrames
        ) {
          this.enemySprite.textures = movingFrames;
          this.enemySprite.play();
        }
      } else {
        // Switch to standing animation
        if (
          !this.enemySprite.playing ||
          this.enemySprite.textures !== standingFrames
        ) {
          this.enemySprite.textures = standingFrames;
          this.enemySprite.play();
        }
      }
    }

    // Mirror the sprite based on movement direction
    this.enemySprite.scale.x = this.direction.x < 0 ? -1 : 1;
  }

  protected attack(projectileSprite: string, damage: number) {
    this.throwTimer += this.app.ticker.elapsedMS;

    if (this.throwTimer >= this.throwInterval) {
      this.throwProjectile(projectileSprite, damage);
      this.throwTimer = 0;
      this.throwInterval = Math.floor(Math.random() * 4000) + 5000;
    }
  }

  protected throwProjectile(projectileSprite: string, damage: number): void {
    const projectile = new Projectile(
      this.app,
      this.layer,
      this.enemySprite.x,
      this.enemySprite.y,
      5,
      projectileSprite,
      new PIXI.Point(this.direction.x, this.direction.y),
      damage
    );

    this.projectiles.push(projectile);
  }

  public receiveDamage(damage: number): void {
    if (!this.isHit) {
      this.health -= damage;
      this.isHit = true;
    }

    if (this.health <= 0) {
      this.handleDeath();
    }
  }

  protected handleDeath() {
    this.isDead = true;
    this.layer.removeChild(this.enemySprite);
    this.projectiles.forEach((projectile) => projectile.destroy());
  }

  public getDeathState() {
    return this.isDead;
  }

  public getSprite() {
    return this.enemySprite;
  }

  public getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  public destroy() {
    if (this.enemySprite.parent) {
      this.enemySprite.parent.removeChild(this.enemySprite);
    }
  }

  public spawnCoin() {}

  public update() {
    this.moveRandomly();

    for (const projectile of this.projectiles) {
      projectile.update();
    }

    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.isDestroyed
    );
  }
}
