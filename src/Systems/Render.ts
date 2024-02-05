import { Entity } from '../Entities/Entity';

export class RenderSystem {
  static update(entities: Entity[]) {
    entities.forEach((entity) => {
      const renderComponent = entity.getComponent('render');
      const positionComponent = entity.getComponent('position');

      if (renderComponent && positionComponent) {
        renderComponent.sprite.position.set(
          positionComponent.x,
          positionComponent.y
        );
      }
    });
  }
}
