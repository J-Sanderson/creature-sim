import { utilities } from '../utils/Utilities';
import worldManager from '../managers/WorldManager';
import { DebugManager } from '../managers/DebugManager';
import items from '../entities/items';
import Creature from '../entities/Creature';

export class World {
  static defaults = {
    height: 15,
    width: 15,
    speed: 250,
    cellSize: 50,
    maxMotive: 100,
    lineWidth: 0.1,
    showStatus: false,
    showSliders: false,
    showPersonality: false,
  };

  constructor(el, params = {}) {
    if (!(el instanceof HTMLElement)) {
      console.error(`Error: ${el} is not a valid HTML element`);
      return;
    }

    this.params = {};
    for (let param in World.defaults) {
      this.params[param] = params.hasOwnProperty(param)
        ? params[param]
        : World.defaults[param];
    }

    this.elements = {
      root: el,
    };

    this.entities = {
      items: new Map(),
      creatures: new Map(),
    };

    this.guid = utilities.generateGUID();
    worldManager.addWorld(this.guid, this);

    this.debugManager = new DebugManager();

    this.init();
  }

  init() {
    let canvasWrapper = document.createElement('div');
    canvasWrapper.classList.add('world-wrapper');
    this.elements.root.appendChild(canvasWrapper);
    this.elements.canvasWrapper = canvasWrapper;
    let canvas = document.createElement('canvas');
    canvas.classList.add('world-canvas');
    this.elements.canvasWrapper.appendChild(canvas);
    this.elements.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.drawWorld();

    let toybox = document.createElement('div');
    toybox.classList.add('toybox');
    toybox.dataset.world = this.guid;
    this.elements.root.appendChild(toybox);
    this.elements.toybox = toybox;

    items.forEach((item) => {
      let button = document.createElement('button');
      button.innerHTML = item.icon;
      button.style['font-size'] = `${this.params.cellSize}px`;
      button.id = `btn-${item.className}`;
      button.dataset.adjectives = item.adjectives;
      button.dataset.flavors = item.flavors ? item.flavors : [];
      button.dataset.colors = item.colors ? item.colors : [];
      button.addEventListener('click', (e) => {
        this.toggleItem(button, item, e.isTrusted);
      });
      this.elements.toybox.appendChild(button);
    });

    this.addEntity(
      Creature,
      {
        xPos: utilities.rand(this.params.width),
        yPos: utilities.rand(this.params.height),
      },
      'creatures'
    );

    if (this.params.showStatus) {
      this.debugManager.showStatusWrapper(this);
      this.entities.creatures.forEach((creature) => {
        this.debugManager.showCreatureStatus(this, creature);
        this.debugManager.updateCreatureStatus(creature);
      });
    }

    if (this.params.showSliders) {
      this.entities.creatures.forEach((creature) => {
        this.debugManager.showCreatureSliders(this, creature);
        this.debugManager.updateCreatureSliders(creature);
      });
    }

    if (this.params.showPersonality) {
      this.entities.creatures.forEach((creature) => {
        this.debugManager.showCreaturePersonality(this, creature);
      });
    }

    this.motion = setInterval(() => this.tick(), this.params.speed);
  }

  drawWorld() {
    this.ctx.clearRect(
      0,
      0,
      this.params.width * this.params.cellSize,
      this.params.height * this.params.cellSize
    );
    this.elements.canvas.width = this.params.width * this.params.cellSize;
    this.elements.canvas.height = this.params.height * this.params.cellSize;
    for (let i = 0; i < this.params.height; i++) {
      for (let j = 0; j < this.params.width; j++) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = this.params.lineWidth;
        this.ctx.rect(
          i * this.params.cellSize,
          j * this.params.cellSize,
          this.params.cellSize,
          this.params.cellSize
        );
        this.ctx.stroke();
      }
    }
  }

  tick() {
    this.entities.creatures.forEach((creature) => {
      creature.update();
      if (this.params.showStatus) {
        this.debugManager.updateCreatureStatus(creature);
      }
      if (this.params.showSliders) {
        this.debugManager.updateCreatureSliders(creature);
      }
    });
  }

  broadcast(eventName, params = {}) {
    this.getCreatures().forEach((creature) => {
      const event = new CustomEvent(eventName, params);
      creature.getOutputs().icon.dispatchEvent(event);
    });
  }

  toggleItem(button, item, isUserClick) {
    let entityId = button.dataset.entityId;
    if (entityId) {
      this.deleteEntity(entityId);
      this.broadcast('deleteItem', { detail: entityId });
    } else {
      let position = this.findEmptyPosition();
      if (position) {
        const newItem = this.addEntity(item, position);
        button.classList.add('item-active');
        button.dataset.entityId = newItem;
        if (isUserClick) {
          this.broadcast('addItem', { detail: newItem });
        }
      }
    }
  }

  addEntity(entityClass, position, entityType = 'items') {
    if (!this.entities.hasOwnProperty(entityType)) {
      console.error('Error: invalid entity type');
      return;
    }
    let newItem = new entityClass(this.getGUID(), position);
    const entityId = newItem.getGUID();
    this.entities[entityType].set(entityId, newItem);
    return entityId;
  }

  displayEntity(icon) {
    this.elements.canvasWrapper.appendChild(icon);
  }

  moveEntity(icon, position) {
    if (
      !(icon instanceof HTMLDivElement) ||
      !icon.classList.contains('entity')
    ) {
      console.error('Error: invalid icon element');
      return;
    }
    icon.style.left = `${
      position.x * this.params.cellSize + this.params.lineWidth
    }px`;
    icon.style.top = `${
      position.y * this.params.cellSize + this.params.lineWidth
    }px`;
  }

  deleteEntity(id, type = 'items') {
    let button = this.elements.toybox.querySelector(`[data-entity-id="${id}"]`);
    if (button) {
      delete button.dataset.entityId;
      button.classList.remove('item-active');
    }
    this.entities[type].get(id).outputs.icon.remove();
    this.entities[type].delete(id);
  }

  findEmptyPosition(maxAttempts = 10000) {
    let existingItems = this.getItems();
    for (let i = 0; i < maxAttempts; i++) {
      const xPos = utilities.rand(this.params.width);
      const yPos = utilities.rand(this.params.height);
      let spaceFree = true;
      existingItems.forEach((existingItem) => {
        let existingPos = existingItem.getPosition();
        if (existingPos.x === xPos && existingPos.y === yPos) {
          spaceFree = false;
        }
      });
      if (spaceFree) {
        return { xPos, yPos };
      }
    }
    console.error('Error: no free space found');
    return null;
  }

  getParam(param) {
    if (!this.params.hasOwnProperty(param)) {
      console.error(`Error: world ${this.guid} has no parameter ${param}`);
      return;
    }
    return this.params[param];
  }

  getElement(element) {
    if (!this.elements.hasOwnProperty(element)) {
      console.error(`Error: world ${this.guid} has no element ${element}`);
      return;
    }
    return this.elements[element];
  }

  getGUID() {
    return this.guid;
  }

  getEntities() {
    return this.entities;
  }

  getItems() {
    return this.entities.items;
  }

  getItem(id) {
    return this.entities.items.get(id);
  }

  getCreatures() {
    return this.entities.creatures;
  }

  getCreature(id) {
    return this.entities.creatures.get(id);
  }

  getBounds() {
    return { x: this.params.width, y: this.params.height };
  }
}
