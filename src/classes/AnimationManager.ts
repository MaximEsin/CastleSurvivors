import * as PIXI from 'pixi.js';

export class AnimationManager {
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  createAnimation(
    texturePaths: string[],
    x: number,
    y: number
  ): PIXI.AnimatedSprite {
    const textures = texturePaths.map((path) => PIXI.Texture.from(path));
    const animation = new PIXI.AnimatedSprite(textures);

    animation.x = x;
    animation.y = y;
    animation.animationSpeed = 0.1;
    animation.play();

    this.app.stage.addChild(animation);

    return animation;
  }
}
