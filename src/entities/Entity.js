import { World } from '../world/World';
import worldManager from '../managers/WorldManager';
import { utilities } from '../utils/Utilities';

export default class Entity {
  constructor(world, params = {}) {
    let worldObj = worldManager.getWorld(world);
    if (!worldObj || !(worldObj instanceof World)) {
      console.error(`Error: ${world} is not a valid World object`);
      return;
    }

    this.world = world;
    this.order = 1;
    this.guid = utilities.generateGUID();

    this.outputs = {};
    this.eventHandlers = {};
    this.properties = {
      adjectives: [],
      flavors: [],
      colors: [],
    };

    const worldBounds = worldObj.getBounds();
    this.bounds = {
      x: worldBounds.x,
      y: worldBounds.y,
    }

    this.maxMotive = worldObj.getParam('maxMotive');
    this.status = {
      position: {
        x: params.hasOwnProperty('xPos') ? params.xPos : 0,
        y: params.hasOwnProperty('yPos') ? params.yPos : 0,
      },
      motives: {},
    };

    this.init();
  }

  init() {
    let world = worldManager.getWorld(this.world);
    let cellSize = world.getParam('cellSize');
    let lineWidth = world.getParam('lineWidth');

    let icon = document.createElement('div');
    icon.classList.add('entity');
    icon.style.width = `${cellSize}px`;
    icon.style.height = `${cellSize}px`;
    icon.style.left = `${this.status.position.x * cellSize + lineWidth}px`;
    icon.style.top = `${this.status.position.y * cellSize + lineWidth}px`;
    this.outputs.icon = icon;

    world.displayEntity(this.outputs.icon);
  }

  getWorld() {
    return this.world;
  }

  getGUID() {
    return this.guid;
  }

  getAdjectives() {
    return this.properties.adjectives;
  }

  getFlavors() {
    return this.properties.flavors;
  }

  getColors() {
    return this.properties.colors;
  }

  getPosition() {
    return this.status.position;
  }

  getBounds() {
    return this.bounds;
  }

  getStatus() {
    return this.status;
  }

  getOutputs() {
    return this.outputs;
  }

  getMaxMotive() {
    return this.maxMotive;
  }

  getMotives() {
    return this.status.motives;
  }

  getMotive(motive) {
    if (!(motive in this.status.motives)) {
      console.error(`Error: no ${motive} motive found`);
      return;
    }
    return this.status.motives[motive];
  }

  setMotive(motive, value) {
    if (!this.status.motives.hasOwnProperty(motive)) {
      console.error(`Error: Invalid motive ${motive}`);
      return;
    }

    if (value < 0) {
      this.status.motives[motive] = 0;
      return;
    }
    if (value > this.maxMotive) {
      this.status.motives[motive] = this.maxMotive;
      return;
    }

    this.status.motives[motive] = value;
  }

  setIcon() {
    let world = worldManager.getWorld(this.world);
    let cellSize = world.getParam('cellSize');
    let span = document.createElement('span');
    span.innerHTML = this.icon ? this.icon : '&#x2753;';
    this.outputs.icon.prepend(span);
    this.outputs.icon.style['font-size'] = `${cellSize}px`;
    this.outputs.icon.style['z-index'] = this.order;
  }

  getIcon() {
    const outputs = this.getOutputs();
    if (!outputs.hasOwnProperty('icon')) {
      console.error(`Error: no icon found for entity ${this.getGUID()}`);
    }
    return outputs.icon;
  }

  setXPosition(pos) {
    if (pos < 0) {
      this.status.position.x = 0;
      return;
    }

    const bounds = this.getBounds();
    if (pos > bounds.x) {
      this.status.position.x = bounds.x;
      return;
    }

    this.status.position.x = pos;
  }

  setYPosition(pos) {
    if (pos < 0) {
      this.status.position.y = 0;
      return;
    }

    const bounds = this.getBounds();
    if (pos > bounds.y) {
      this.status.position.y = bounds.y;
      return;
    }

    this.status.position.y = pos;
  }
}
