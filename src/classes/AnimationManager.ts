import * as PIXI from 'pixi.js';

export class AnimationManager {
  public getPlayerStandingAnimation(): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = 0; i < 19; i++) {
      const texturePath = PIXI.Texture.from(
        `./public/Player/standing/standing${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }

  public getPlayerMovingAnimation(): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = 20; i < 39; i++) {
      const texturePath = PIXI.Texture.from(
        `./public/Player/moving/moving${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }
}
