import { World } from '../world/World';
import worldManager from '../world/WorldManager';
import { utilities } from '../utils/Utilities';

export default class Entity {
  static adjectiveList = {
    inanimate: 'inanimate',
    animate: 'animate',
    tasty: 'tasty',
    wet: 'wet',
    restful: 'restful',
    chew: 'chew',
    bounce: 'bounce',
    soft: 'soft',
  };

  static flavorList = {
    chicken: 'chicken',
    beef: 'beef',
    fish: 'fish',
    water: 'water',
  };

  static colorList = {
    white: 'white',
    black: 'black',
    red: 'red',
    green: 'green',
    yellow: 'yellow',
    blue: 'blue',
    purple: 'purple',
    pink: 'pink',
    orange: 'orange',
    brown: 'brown',
    grey: 'grey',
    clear: 'clear',
  };

  static motiveList = {
    fullness: 'fullness',
    hydration: 'hydration',
    energy: 'energy',
    amount: 'amount',
  };

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

    this.maxMotive = worldManager.getWorld(this.world).getParam('maxMotive');
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
    const world = worldManager.getWorld(this.world);
    return world.getBounds();
  }

  getStatus() {
    return this.status;
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
      console.error('Invalid motive');
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

  setXPosition(pos) {
    this.status.position.x = pos;
  }

  setYPosition(pos) {
    this.status.position.y = pos;
  }
}
