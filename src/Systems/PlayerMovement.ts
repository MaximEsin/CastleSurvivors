import { System } from 'tick-knock';
import { engine } from '../Engine';
import { Position } from '../Components/Position';
import { Entity } from 'tick-knock';

export class PlayerMovementSystem extends System {
  private keys: { [key: string]: boolean } = {};

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

  update(delta: number) {
    const playerEntities: ReadonlyArray<Entity> = engine.entities.filter(
      (entity: Entity) => entity.has(Position)
    );

    playerEntities.forEach((entity: Entity) => {
      const position = entity.get(Position);
      if (!position) return;
      if (this.keys['w']) position.y -= 5;
      if (this.keys['s']) position.y += 5;
      if (this.keys['a']) position.x -= 5;
      if (this.keys['d']) position.x += 5;
    });
  }
}
