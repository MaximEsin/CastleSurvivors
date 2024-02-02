import * as PIXI from 'pixi.js';

export class AnimationManager {
  private createAnimation(
    char: string,
    action: string,
    framesCount: number
  ): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = 1; i < framesCount; i++) {
      const texturePath = PIXI.Texture.from(
        `./public/${char}/${action}/${action}${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }

  public getPlayerStandingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'standing', 5);
  }

  public getPlayerMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'moving', 9);
  }

  public getPlayerDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'damaged', 5);
  }

  public getPlayerDyingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'dying', 5);
  }

  public getMushroomStandingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Mushroom', 'standing', 5);
  }

  public getMushroomMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Mushroom', 'moving', 9);
  }

  public getMushroomDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Mushroom', 'damaged', 5);
  }

  public getEyeDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Eye', 'damaged', 5);
  }

  public getEyeFlyingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Eye', 'moving', 9);
  }

  public getSkeletonStandingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Skeleton', 'standing', 5);
  }

  public getSkeletonMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Skeleton', 'moving', 5);
  }

  public getSkeletonDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Skeleton', 'damaged', 5);
  }

  public getMerchantStandingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Merchant', 'standing', 12);
  }

  public getMerchantInteractAnimation(): PIXI.Texture[] {
    return this.createAnimation('Merchant', 'interact', 9);
  }
}
