import * as PIXI from 'pixi.js';

export class AnimationManager {
  private static createAnimation(
    char: string,
    action: string,
    framesCount: number
  ): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = 1; i < framesCount; i++) {
      const texturePath = PIXI.Texture.from(
        `/${char}/${action}/${action}${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }

  public static getPlayerStandingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'standing', 5);
  }

  public static getPlayerMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'moving', 9);
  }

  public static getPlayerDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'damaged', 5);
  }

  public static getPlayerDyingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'dying', 5);
  }

  public static getMushroomMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Mushroom', 'moving', 9);
  }

  public static getMushroomDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Mushroom', 'damaged', 5);
  }

  public static getEyeDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Eye', 'damaged', 5);
  }

  public static getEyeFlyingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Eye', 'moving', 9);
  }

  public static getSkeletonMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Skeleton', 'moving', 5);
  }

  public static getSkeletonDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Skeleton', 'damaged', 5);
  }

  public static getMerchantStandingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Merchant', 'standing', 12);
  }

  public static getMerchantInteractAnimation(): PIXI.Texture[] {
    return this.createAnimation('Merchant', 'interact', 9);
  }
}
