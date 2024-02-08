import { Entity, System } from 'tick-knock';
import * as PIXI from 'pixi.js';
import { Position } from '../../Components/Position';
import { EnemyProjectileEntity } from '../Entities/Projectile';
import { EnemyComponent } from '../Components/Enemy';
import { MushroomComponent } from '../Components/Mushroom';
import { Velocity } from '../../Components/Velocity';
import { PlayerComponent } from '../../Player/PlayerComponent';
import { Health } from '../../Components/Health';
import { DamageComponent } from '../../Components/Damage';

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

    this.engine.entities.forEach((entity) => {
      if (entity.hasTag('Projectile')) {
        if (this.checkCollisionWithPlayer(entity)) {
          const damage = entity.get(DamageComponent);
          if (damage) this.applyDamageToPlayer(damage.damage);
          this.engine.removeEntity(entity);
          const projectileSprite = entity.get<PIXI.Sprite>(PIXI.Sprite);
          if (projectileSprite) this.app.stage.removeChild(projectileSprite);
        }
      }
    });
  }

  private checkCollisionWithPlayer(projectileEntity: Entity): boolean {
    const playerEntity = this.engine.entities.find((entity) =>
      entity.has(PlayerComponent)
    );
    if (!playerEntity) return false;

    const playerPosition = playerEntity.get(Position);
    const projectilePosition = projectileEntity.get(Position);
    if (!playerPosition || !projectilePosition) return false;

    const distance = Math.sqrt(
      Math.pow(projectilePosition.x - playerPosition.x, 2) +
        Math.pow(projectilePosition.y - playerPosition.y, 2)
    );

    const collisionThreshold = 70;

    return distance < collisionThreshold;
  }

  private applyDamageToPlayer(damage: number) {
    const playerEntity = this.engine.entities.find((entity) =>
      entity.has(PlayerComponent)
    );
    if (!playerEntity) return;

    const health = playerEntity.get(Health);
    if (!health) return;
    health.value -= damage;
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
    let damage: number | undefined;
    const mushroomProjectileSprite = new PIXI.Sprite(
      PIXI.Texture.from('/Enemies/Mushroom/projectile/projectile.png')
    );
    if (entity.has(MushroomComponent)) {
      sprite = mushroomProjectileSprite;
      damage = 10;
    }

    const projectile = new EnemyProjectileEntity(
      new Position(position.x, position.y),
      new Velocity(enemyData.enemyDirectionX, enemyData.enemyDirectionY),
      sprite || new PIXI.Sprite()
    );
    projectile.add(new DamageComponent(damage || 0));
    this.app.stage.addChild(projectile.sprite);
    this.engine.addEntity(projectile);
  }
}
