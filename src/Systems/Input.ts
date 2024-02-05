import { Entity } from '../Entities/Entity';

export class InputSystem {
  static update(entities: Entity[]) {
    entities.forEach((entity) => {
      const positionComponent = entity.getComponent('position');
      const playerComponent = entity.getComponent('player');
      if (positionComponent && playerComponent) {
        const speed = 5;

        if (InputSystem.isKeyDown('w')) {
          positionComponent.y -= speed;
        }
        if (InputSystem.isKeyDown('a')) {
          positionComponent.x -= speed;
        }
        if (InputSystem.isKeyDown('s')) {
          positionComponent.y += speed;
        }
        if (InputSystem.isKeyDown('d')) {
          positionComponent.x += speed;
        }
      }
    });
  }

  private static keyState: Record<string, boolean> = {};

  static setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      InputSystem.keyState[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      InputSystem.keyState[e.key] = false;
    });
  }

  private static isKeyDown(key: string): boolean {
    return InputSystem.keyState[key];
  }
}
