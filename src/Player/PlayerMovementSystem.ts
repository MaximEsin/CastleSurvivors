import { System } from 'tick-knock';
import { engine } from '../Engine';
import { Position } from '../Components/Position';
import { Entity } from 'tick-knock';

export class PlayerMovementSystem extends System {
  private keys: { [key: string]: boolean } = {};
  public isPlayerMoving: boolean = false;

  constructor() {
    super();
    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));
  }

  private onKeyDown(event: KeyboardEvent) {
    this.keys[event.key] = true;
  }

  private onKeyUp(event: KeyboardEvent) {
    this.keys[event.key] = false;
  }

  update() {
    const playerEntities: ReadonlyArray<Entity> = engine.entities.filter(
      (entity: Entity) => entity.has(Position)
    );

    playerEntities.forEach((entity: Entity) => {
      const position = entity.get(Position);
      this.isPlayerMoving = false;

      if (!position) return;
      if (this.keys['w']) {
        this.isPlayerMoving = true;
        position.y -= 5;
      }
      if (this.keys['s']) {
        this.isPlayerMoving = true;
        position.y += 5;
      }
      if (this.keys['a']) {
        this.isPlayerMoving = true;
        position.x -= 5;
      }
      if (this.keys['d']) {
        this.isPlayerMoving = true;
        position.x += 5;
      }
    });
  }
}
