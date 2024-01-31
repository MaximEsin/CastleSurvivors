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
    return this.createAnimation('Player', 'standing', 4);
  }

  public getPlayerMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'moving', 8);
  }

  public getPlayerDamagedAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'damaged', 4);
  }

  public getPlayerDyingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'dying', 4);
  }

  public getMushroomStandingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Mushroom', 'standing', 4);
  }

  public getMushroomMovingAnimation(): PIXI.Texture[] {
    return this.createAnimation('Enemies/Mushroom', 'moving', 8);
  }
}
