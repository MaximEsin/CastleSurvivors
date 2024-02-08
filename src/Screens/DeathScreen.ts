import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Entity } from 'tick-knock';
import { Health } from '../Components/Health';
import { PlayerComponent } from '../Player/Components/PlayerComponent';

export class DeathScreen extends System {
  private deathScreen: PIXI.Sprite;
  private deathScreenVisible: boolean = false;
  private resetButton: PIXI.Sprite;

  constructor(private app: PIXI.Application) {
    super();
    this.deathScreen = this.createDeathScreen();
    this.resetButton = this.createResetButton();
  }

  private createDeathScreen(): PIXI.Sprite {
    const deathScreenTexture = PIXI.Texture.from(
      './Interface/deathscreen.jpeg'
    );
    const deathScreenSprite = new PIXI.Sprite(deathScreenTexture);
    deathScreenSprite.width = this.app.screen.width;
    deathScreenSprite.height = this.app.screen.height;
    deathScreenSprite.visible = false;
    this.app.stage.addChild(deathScreenSprite);
    return deathScreenSprite;
  }

  private createResetButton(): PIXI.Sprite {
    const resetButtonTexture = PIXI.Texture.from('./Interface/resetbtn.png');
    const resetButtonSprite = new PIXI.Sprite(resetButtonTexture);
    resetButtonSprite.anchor.set(1);
    resetButtonSprite.position.set(
      this.app.screen.width / 2 - 250,
      this.app.screen.height / 2 + 150
    );
    resetButtonSprite.interactive = true;
    resetButtonSprite.on('pointerdown', this.resetGame.bind(this));
    this.deathScreen.addChild(resetButtonSprite);
    return resetButtonSprite;
  }

  private resetGame() {
    window.location.reload();
  }

  public show() {
    this.deathScreen.visible = true;
    this.deathScreenVisible = true;
  }

  public isVisible(): boolean {
    return this.deathScreenVisible;
  }

  public getResetButton() {
    return this.resetButton;
  }

  update(): void {
    this.engine.entities.forEach((entity: Entity) => {
      if (entity.has(Health) && entity.has(PlayerComponent)) {
        const health = entity.get<Health>(Health);

        if (!health) return;

        if (health.value <= 0 && !this.isVisible()) {
          this.show();
        }
      }
    });
  }
}
