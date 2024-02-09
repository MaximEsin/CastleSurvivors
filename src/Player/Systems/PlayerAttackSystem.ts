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
      if (event.key === 'c') {
        const playerPosition = entity.get(Position);
        const playerDirection = entity.get(Direction);
        const sprite = entity.get<PIXI.AnimatedSprite>(PIXI.AnimatedSprite);
        if (playerPosition && playerDirection && sprite) {
          const projectilePosition = this.calculateProjectileStartPosition(
            playerPosition,
            playerDirection,
            sprite
          );
          this.createProjectile(projectilePosition, playerDirection);
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

  private createProjectile(position: Position, direction: Direction) {
    const projectileEntity = new ProjectileEntity();
    const projectileSprite = PIXI.Sprite.from('/Player/weapons/knife.png');
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

  private spawnCoin(position: Position) {
    const coinEntity = new CoinEntity(position);
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
                if (enemyHealth) {
                  enemyHealth.value -= 5;

                  if (enemyHealth.value <= 0) {
                    if (entity.has(MushroomComponent)) {
                      this.spawnCoin(enemyPosition);
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
