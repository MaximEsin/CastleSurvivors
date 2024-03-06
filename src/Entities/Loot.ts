import * as PIXI from 'pixi.js';
import { LootType } from '../Enums/LootType';

export class Loot extends PIXI.Container {
  private lootSprite: PIXI.Sprite;
  private isCollected: boolean = false;
  private lootValue: number = 1;
  private lootType: LootType;

  constructor(x: number, y: number, lootType: LootType) {
    super();
    this.lootType = lootType;
    this.lootSprite = this.createLoot();
    this.lootSprite.anchor.set(0.5);
    this.lootSprite.position.set(x, y);
  }

  private createLoot() {
    if (this.lootType === LootType.Coin) {
      const sprite = new PIXI.Sprite(PIXI.Texture.from('/Shop/coin.png'));
      this.lootValue = 1;

      return sprite;
    } else if (this.lootType === LootType.Diamond) {
      const sprite = new PIXI.Sprite(PIXI.Texture.from('/Shop/diamond.png'));
      this.lootValue = 10;

      return sprite;
    } else if (this.lootType === LootType.Megadiamond) {
      const sprite = new PIXI.Sprite(
        PIXI.Texture.from('/Shop/megaDiamond.png')
      );
      this.lootValue = 20;

      return sprite;
    } else {
      return new PIXI.Sprite(PIXI.Texture.from('/Shop/coin.png'));
    }
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
