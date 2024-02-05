import * as PIXI from 'pixi.js';
import { Entity } from './Entities/Entity';
import { PositionComponent } from './Components/Position';
import { RenderComponent } from './Components/Render';
import { RenderSystem } from './Systems/Render';
import { BackgroundEntity } from './Entities/Background';
import { InputSystem } from './Systems/Input';

class Game {
  private app: PIXI.Application;
  private entities: Entity[] = [];

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
    });
    document.body.appendChild(this.app.view as unknown as Node);
  }

  public initialize() {
    this.createEntities();
    InputSystem.setupInputListeners();
    this.setupGameLoop();
  }

  private createEntities() {
    // Background
    const backgroundImagePath = '/Backgrounds/CastleBG.jpg';
    const backgroundEntity = new BackgroundEntity(
      this.app.screen.width,
      this.app.screen.height,
      backgroundImagePath
    );

    this.entities.push(backgroundEntity);

    // Player
    const playerEntity = new Entity(1);
    const playerFrames = [];
    for (let i = 1; i <= 4; i++) {
      playerFrames.push(PIXI.Texture.from(`/Player/standing/standing${i}.png`));
    }
    const playerAnimatedSprite = new PIXI.AnimatedSprite(playerFrames);
    playerAnimatedSprite.anchor.set(0.5);
    playerAnimatedSprite.animationSpeed = 0.1;
    playerAnimatedSprite.play();
    playerEntity.addComponent(
      'position',
      new PositionComponent(
        this.app.screen.width / 2,
        this.app.screen.height / 2
      )
    );
    playerEntity.addComponent(
      'render',
      new RenderComponent(playerAnimatedSprite)
    );
    playerEntity.addComponent('player', true);

    this.entities.push(playerEntity);

    this.entities.forEach((entity) => {
      this.app.stage.addChild(entity.getComponent('render').sprite);
    });
  }

  private setupGameLoop() {
    this.app.ticker.add(() => {
      RenderSystem.update(this.entities);
      InputSystem.update(this.entities);
    });
  }
}

const game = new Game();
game.initialize();
