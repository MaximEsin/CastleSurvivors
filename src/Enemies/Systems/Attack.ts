import { Entity, System } from 'tick-knock';
import * as PIXI from 'pixi.js';
import { Position } from '../../Components/Position';
import { EnemyProjectileEntity } from '../Entities/Projectile';
import { EnemyComponent } from '../Components/Enemy';
import { MushroomComponent } from '../Components/Mushroom';
import { Velocity } from '../../Components/Velocity';

export class EnemyAttackSystem extends System {
  private app: PIXI.Application;
  private lastAttackTime: number = 0;
  private attackInterval: number = 600;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
  }

  update(delta: number) {
    this.lastAttackTime += delta;

    if (this.lastAttackTime >= this.attackInterval) {
      this.lastAttackTime = 0;

      this.performAttack();
    }
  }

  private performAttack() {
    this.engine.entities.forEach((entity) => {
      if (entity.has(EnemyComponent) && entity.has(Position)) {
        const position = entity.get(Position);
        const enemyData = entity.get(EnemyComponent);
        if (position && enemyData)
          this.spawnProjectile(position, entity, enemyData);
      }
    });
  }

  private spawnProjectile(
    position: Position,
    entity: Entity,
    enemyData: EnemyComponent
  ) {
    let sprite: PIXI.Sprite | undefined;
    const mushroomProjectileSprite = new PIXI.Sprite(
      PIXI.Texture.from('/Enemies/Mushroom/projectile/projectile.png')
    );
    if (entity.has(MushroomComponent)) {
      sprite = mushroomProjectileSprite;
    }

    const projectile = new EnemyProjectileEntity(
      new Position(position.x, position.y),
      new Velocity(enemyData.enemyDirectionX, enemyData.enemyDirectionY),
      sprite || new PIXI.Sprite()
    );
    this.app.stage.addChild(projectile.sprite);
    this.engine.addEntity(projectile);
  }
}
