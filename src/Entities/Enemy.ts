import * as PIXI from 'pixi.js';
import { EnemyType } from '../Enums/EnemyType';
import { AnimationManager } from '../GameCore/AnimationManager';
import { Player } from './Player';
import { LootType } from '../Enums/LootType';

export class Enemy extends PIXI.Container {
  private enemySprite: PIXI.AnimatedSprite;
  private movingAnimation: PIXI.Texture[] =
    AnimationManager.getMushroomMovingAnimation();
  private damagedAnimation: PIXI.Texture[] =
    AnimationManager.getMushroomDamagedAnimation();
  private direction: PIXI.Point = new PIXI.Point(1, 1);
  private speed: number = Math.floor(Math.random() * 4) + 1;
  private health: number = 10;
  private meleeDamage: number = 5;
  private isDamaged: boolean = false;
  private lootType: LootType = LootType.Coin;

  constructor(enemyType: EnemyType) {
    super();
    this.enemySprite = this.createEnemy(enemyType);
  }

  private createEnemy(enemyType: EnemyType): PIXI.AnimatedSprite {
    if (enemyType === EnemyType.Mushroom) {
      const textures = this.movingAnimation;
      const animation = new PIXI.AnimatedSprite(textures);

      this.enemySprite = animation;
    } else if (enemyType === EnemyType.Eye) {
      const textures = AnimationManager.getEyeFlyingAnimation();
      const animation = new PIXI.AnimatedSprite(textures);

      this.enemySprite = animation;

      this.movingAnimation = AnimationManager.getEyeFlyingAnimation();
      this.damagedAnimation = AnimationManager.getEyeDamagedAnimation();

      this.meleeDamage = 10;
      this.health = 20;
      this.lootType = LootType.Diamond;
    } else if (enemyType === EnemyType.Skeleton) {
      const textures = AnimationManager.getSkeletonMovingAnimation();
      const animation = new PIXI.AnimatedSprite(textures);

      this.enemySprite = animation;

      this.movingAnimation = AnimationManager.getSkeletonMovingAnimation();
      this.damagedAnimation = AnimationManager.getSkeletonDamagedAnimation();

      this.meleeDamage = 20;
      this.health = 30;
      this.lootType = LootType.Megadiamond;
    }

    this.enemySprite.animationSpeed = 0.1;
    this.enemySprite.anchor.set(0.5);
    this.enemySprite.play();

    return this.enemySprite;
  }

  private adjustEnemyRotation(): void {
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

  public getSprite() {
    return this.enemySprite;
  }

  public setRandomPosition(
    app: PIXI.Application,
    animation: PIXI.AnimatedSprite
  ): void {
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    const borderOffset = -150;

    const spawnNearHorizontal = Math.random() < 0.5;

    if (spawnNearHorizontal) {
      const spawnOnLeft = Math.random() < 0.5;
      animation.x = spawnOnLeft
        ? Math.max(0, -borderOffset)
        : Math.min(screenWidth, screenWidth + borderOffset);

      animation.y = Math.random() * screenHeight;
    } else {
      const spawnOnTop = Math.random() < 0.5;
      animation.x = Math.random() * screenWidth;
      animation.y = spawnOnTop
        ? Math.max(0, -borderOffset)
        : Math.min(screenHeight, screenHeight + borderOffset);
    }
  }

  public moveToPlayer(player: Player): void {
    const dx = player.getSprite().x - this.enemySprite.x;
    const dy = player.getSprite().y - this.enemySprite.y;
    const distanceToPlayer = Math.sqrt(dx ** 2 + dy ** 2);
    const stopDistance = 50;

    if (distanceToPlayer > stopDistance) {
      const length = Math.sqrt(dx ** 2 + dy ** 2);
      this.direction.x = dx / length;
      this.direction.y = dy / length;

      const speed = this.speed;
      this.enemySprite.x += this.direction.x * speed;
      this.enemySprite.y += this.direction.y * speed;
    }
    this.adjustEnemyRotation();
  }

  public getMeleeDamage(): number {
    return this.meleeDamage;
  }

  public updateEnemyAnimation() {
    if (this.isDamaged) {
      if (
        !this.enemySprite.playing ||
        this.enemySprite.textures !== this.damagedAnimation
      ) {
        this.enemySprite.textures = this.damagedAnimation;
        this.enemySprite.loop = false;
        this.enemySprite.onComplete = () => {
          this.isDamaged = false;
          this.enemySprite.textures = this.movingAnimation;
          this.enemySprite.loop = true;
        };
        this.enemySprite.play();
      }
    } else {
      if (
        !this.enemySprite.playing ||
        this.enemySprite.textures !== this.movingAnimation
      ) {
        this.enemySprite.textures = this.movingAnimation;
        this.enemySprite.play();
      }
    }
  }

  public setIsDamaged(value: boolean) {
    this.isDamaged = value;
  }

  public setHealth(value: number) {
    this.health -= value;
  }

  public getHealth() {
    return this.health;
  }

  public getLootType() {
    return this.lootType;
  }
}
