import * as PIXI from 'pixi.js';

export class Loot extends PIXI.Container {
  private lootSprite: PIXI.Sprite;
  private isCollected: boolean = false;
  private lootValue: number = 1;

  constructor(x: number, y: number) {
    super();
    this.lootSprite = new PIXI.Sprite(PIXI.Texture.from('/Shop/coin.png'));
    this.lootSprite.anchor.set(0.5);
    this.lootSprite.position.set(x, y);
  }

  public getSprite() {
    return this.lootSprite;
  }

  public collect(): void {
    if (!this.isCollected) {
      this.isCollected = true;
    }
  }

  public getIsCollected(): boolean {
    return this.isCollected;
  }

  public getLootValue() {
    return this.lootValue;
  }
}
