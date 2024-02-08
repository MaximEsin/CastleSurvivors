import { System } from 'tick-knock';
import * as PIXI from 'pixi.js';
import { Health } from '../Components/Health';
import { PlayerComponent } from '../Player/Components/PlayerComponent';

export class PlayerInterfaceSystem extends System {
  private playerInterfaceContainer: PIXI.Container;

  constructor(app: PIXI.Application) {
    super();
    this.playerInterfaceContainer = this.createPlayerInterface(app);
  }

  private createPlayerInterface(app: PIXI.Application): PIXI.Container {
    const playerInterfaceContainer = new PIXI.Container();
    const playerInterfaceHeight = app.screen.height * 0.1;

    const backgroundTexture = PIXI.Texture.from('/Interface/Paper.jpg');
    const backgroundSprite = new PIXI.Sprite(backgroundTexture);
    backgroundSprite.width = app.screen.width;
    backgroundSprite.height = playerInterfaceHeight;
    backgroundSprite.y = app.screen.height - backgroundSprite.height;
    playerInterfaceContainer.addChild(backgroundSprite);

    const iconSize = playerInterfaceHeight * 0.8;

    const icon = PIXI.Sprite.from('Interface/heart.png');
    icon.anchor.set(0.7);
    icon.width = icon.height = iconSize;
    icon.x = app.screen.width / 2;
    icon.y = app.screen.height - playerInterfaceHeight / 2;
    playerInterfaceContainer.addChild(icon);

    const textStyle = new PIXI.TextStyle({
      fill: 'black',
      fontFamily: 'Times New Roman',
      fontSize: playerInterfaceHeight * 0.4,
      align: 'center',
    });

    const text = new PIXI.Text('Health: 100', textStyle);
    text.anchor.set(0.6);
    text.x = app.screen.width / 2;
    text.y = app.screen.height - playerInterfaceHeight / 2 + iconSize / 2;
    playerInterfaceContainer.addChild(text);

    const knifeIconSize = playerInterfaceHeight * 2;
    const knifeIcon = PIXI.Sprite.from('/Player/weapons/knife.png');
    knifeIcon.anchor.set(0.5);
    knifeIcon.width = knifeIcon.height = knifeIconSize;
    knifeIcon.x = app.screen.width * 0.05;
    knifeIcon.y = app.screen.height - playerInterfaceHeight / 2;
    playerInterfaceContainer.addChild(knifeIcon);

    app.stage.addChild(playerInterfaceContainer);

    return playerInterfaceContainer;
  }

  getContainer(): PIXI.Container {
    return this.playerInterfaceContainer;
  }

  update() {
    this.engine.entities.forEach((entity) => {
      if (entity.has(Health) && entity.has(PlayerComponent)) {
        const health = entity.get(Health);
        if (health) {
          const healthText = this.playerInterfaceContainer.getChildAt(
            2
          ) as PIXI.Text;
          healthText.text = `Health: ${health.value}`;
        }
      }
    });
  }
}
