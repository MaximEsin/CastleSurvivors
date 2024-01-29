import * as PIXI from 'pixi.js';

export class AnimationManager {
  public getPlayerStandingAnimation(): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = 1; i < 4; i++) {
      const texturePath = PIXI.Texture.from(
        `./public/Player/standing/standing${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }

  public getPlayerMovingAnimation(): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = 1; i < 8; i++) {
      const texturePath = PIXI.Texture.from(
        `./public/Player/moving/moving${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }
}
