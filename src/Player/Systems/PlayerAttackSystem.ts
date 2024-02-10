import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { Direction } from '../../Components/Direction';
import { Velocity } from '../../Components/Velocity';
import { ProjectileEntity } from '../Entities/Projectile';
import { ProjectileComponent } from '../Components/Projectile';
import { Entity } from 'tick-knock';
import * as PIXI from 'pixi.js';
import { PlayerComponent } from '../Components/PlayerComponent';
import { MushroomComponent } from '../../Enemies/Components/Mushroom';
import { Health } from '../../Components/Health';
import { EyeComponent } from '../../Enemies/Components/Eye';
import { SkeletonComponent } from '../../Enemies/Components/Skeleton';
import { CoinEntity } from '../../Money/Entities/Coin';
import { DiamondEntity } from '../../Money/Entities/Diamond';
import { MegaDiamondEntity } from '../../Money/Entities/MegaDiamond';
import { DamageComponent } from '../../Components/Damage';

export class AttackSystem extends System {
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
    document.addEventListener('keydown', this.handleAttack.bind(this));
  }

  private handleAttack(event: KeyboardEvent) {
    const playerEntities: ReadonlyArray<Entity> = this.engine.entities.filter(
      (entity) => entity.has(PlayerComponent)
    );

    playerEntities.forEach((entity) => {
      const playerPosition = entity.get(Position);
      const playerDirection = entity.get(Direction);
      const sprite = entity.get<PIXI.AnimatedSprite>(PIXI.AnimatedSprite);
      if (playerPosition && playerDirection && sprite) {
        const projectilePosition = this.calculateProjectileStartPosition(
          playerPosition,
          playerDirection,
          sprite
        );
        if (event.key === 'c') {
          this.createProjectile(
            projectilePosition,
            playerDirection,
            event.key,
            entity
          );
        }
        if (event.key === 'v') {
          if (entity.hasTag('EyePurchased')) {
            this.createProjectile(
              projectilePosition,
              playerDirection,
              event.key,
              entity
            );
          }
        }
        if (event.key === 'x') {
          if (entity.hasTag('kebabPurchased')) {
            this.createProjectile(
              projectilePosition,
              playerDirection,
              event.key,
              entity
            );
          }
        }
      }
    });
  }

  private calculateProjectileStartPosition(
    playerPosition: Position,
    playerDirection: Direction,
    sprite: PIXI.AnimatedSprite
  ): Position {
    const projectileX =
      playerPosition.x +
      (playerDirection.x > 0 ? sprite.width / 2 : -sprite.width / 2);
    const projectileY = playerPosition.y;
    return new Position(projectileX, projectileY);
  }

  private createProjectile(
    position: Position,
    direction: Direction,
    key: string,
    player: Entity
  ) {
    const projectileEntity = new ProjectileEntity();
    let projectileSprite: PIXI.Sprite | undefined;

    if (key === 'c') {
      projectileSprite = PIXI.Sprite.from('/Player/weapons/knife.png');
      projectileEntity.add(new DamageComponent(5));
    }

    if (key === 'v') {
      projectileSprite = PIXI.Sprite.from('/Player/weapons/eye.png');
      projectileEntity.add(new DamageComponent(20));
    }

    if (key === 'x') {
      projectileSprite = PIXI.Sprite.from('/Player/weapons/kebab.png');
      projectileEntity.add(new DamageComponent(10));
      const playerHealth = player.get(Health);
      if (playerHealth) playerHealth.value += 5;
    }

    if (projectileSprite) {
      if (direction.x < 0) {
        projectileSprite.scale.x = -1;
      } else if (direction.y < 0) {
        projectileSprite.rotation = -Math.PI / 2;
      } else if (direction.y > 0) {
        projectileSprite.rotation = Math.PI / 2;
      }
      projectileEntity.add(new Position(position.x, position.y));
      projectileEntity.add(new Velocity(direction.x * 5, direction.y * 5));
      projectileEntity.add(new ProjectileComponent());
      projectileEntity.add(projectileSprite);
      this.engine.addEntity(projectileEntity);
      this.app.stage.addChild(projectileSprite);
    }
  }

  private spawnCoin(position: Position) {
    const coinEntity = new CoinEntity(position);
    this.engine.addEntity(coinEntity);
    const coinSprite = coinEntity.get<PIXI.Sprite>(PIXI.Sprite);
    if (coinSprite) this.app.stage.addChild(coinSprite);
  }

  private spawnDiamond(position: Position) {
    const coinEntity = new DiamondEntity(position);
    this.engine.addEntity(coinEntity);
    const coinSprite = coinEntity.get<PIXI.Sprite>(PIXI.Sprite);
    if (coinSprite) this.app.stage.addChild(coinSprite);
  }

  private spawnMegaDiamond(position: Position) {
    const coinEntity = new MegaDiamondEntity(position);
    this.engine.addEntity(coinEntity);
    const coinSprite = coinEntity.get<PIXI.Sprite>(PIXI.Sprite);
    if (coinSprite) this.app.stage.addChild(coinSprite);
  }

  update() {
    this.engine.entities.forEach((entity) => {
      if (entity.has(ProjectileComponent) && entity.has(Position)) {
        const position = entity.get(Position);
        const projectileSprite = entity.get<PIXI.Sprite>(PIXI.Sprite);

        if (position && projectileSprite) {
          projectileSprite.x = position.x;
          projectileSprite.y = position.y;
        }
      }
    });

    this.engine.entities.forEach((entity) => {
      if (
        (entity.has(MushroomComponent) ||
          entity.has(EyeComponent) ||
          entity.has(SkeletonComponent)) &&
        entity.has(Position)
      ) {
        const enemyPosition = entity.get(Position);
        const enemySprite = entity.get<PIXI.AnimatedSprite>(
          PIXI.AnimatedSprite
        );

        this.engine.entities.forEach((projectileEntity) => {
          if (
            projectileEntity.has(ProjectileComponent) &&
            projectileEntity.has(Position)
          ) {
            const projectilePosition = projectileEntity.get(Position);
            const projectileSprite = projectileEntity.get<PIXI.Sprite>(
              PIXI.Sprite
            );

            if (projectilePosition && enemyPosition) {
              if (
                Math.sqrt(
                  Math.pow(projectilePosition.x - enemyPosition.x, 2) +
                    Math.pow(projectilePosition.y - enemyPosition.y, 2)
                ) < 70
              ) {
                const enemyHealth = entity.get(Health);
                const damageComponent = projectileEntity.get(DamageComponent);
                if (enemyHealth && damageComponent) {
                  enemyHealth.value -= damageComponent.damage;

                  if (enemyHealth.value <= 0) {
                    if (entity.has(MushroomComponent)) {
                      this.spawnCoin(enemyPosition);
                    }
                    if (entity.has(EyeComponent)) {
                      this.spawnDiamond(enemyPosition);
                    }
                    if (entity.has(SkeletonComponent)) {
                      this.spawnMegaDiamond(enemyPosition);
                    }
                    this.engine.removeEntity(entity);
                    if (enemySprite) this.app.stage.removeChild(enemySprite);
                  }
                }

                this.engine.removeEntity(projectileEntity);
                if (projectileSprite)
                  this.app.stage.removeChild(projectileSprite);
              }
            }
          }
        });
      }
    });
  }
}
