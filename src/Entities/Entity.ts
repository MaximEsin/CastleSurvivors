export class Entity {
  id: number;
  components: Record<string, any>;

  constructor(id: number) {
    this.id = id;
    this.components = {};
  }

  addComponent(componentName: string, component: any) {
    this.components[componentName] = component;
  }

  getComponent(componentName: string) {
    return this.components[componentName];
  }
}
