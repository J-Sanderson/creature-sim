import { utilities } from '../utils/Utilities';
import worldManager from './WorldManager';
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

  static statusOutputs = ['plan', 'state'];
  static goalOutputs = ['goals', 'currentGoal'];

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

    if (this.params.showStatus) {
      let statusWrapper = document.createElement('div');
      statusWrapper.classList.add('status-wrapper');
      statusWrapper.innerHTML = '<p>Status</p>';
      this.elements.root.appendChild(statusWrapper);
      this.elements.statusWrapper = statusWrapper;
    }

    items.forEach((item) => {
      let button = document.createElement('button');
      button.innerHTML = item.icon;
      button.style['font-size'] = `${this.params.cellSize}px`;
      button.dataset.adjectives = item.adjectives;
      button.dataset.flavors = item.flavors ? item.flavors : [];
      button.dataset.colors = item.colors ? item.colors : [];
      button.addEventListener('click', () => {
        this.toggleItem(button, item);
      });
      this.elements.toybox.appendChild(button);
    });

    let creature = new Creature(this.guid, {
      xPos: utilities.rand(this.params.width),
      yPos: utilities.rand(this.params.height),
    });
    this.entities.creatures.set(creature.getGUID(), creature);

    if (this.params.showStatus) {
      this.entities.creatures.forEach((creature) => {
        this.showCreatureStatus(creature);
        this.updateCreatureStatus(creature);
      });
    }

    if (this.params.showSliders) {
      this.entities.creatures.forEach((creature) => {
        this.showCreatureSliders(creature);
        this.updateCreatureSliders(creature);
      });
    }

    if (this.params.showPersonality) {
      this.entities.creatures.forEach((creature) => {
        this.showCreaturePersonality(creature);
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
    for (var i = 0; i < this.params.height; i++) {
      for (var j = 0; j < this.params.width; j++) {
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
        this.updateCreatureStatus(creature);
      }
      if (this.params.showSliders) {
        this.updateCreatureSliders(creature);
      }
    });
  }

  toggleItem(button, item) {
    let entityId = button.dataset.entityId;
    if (entityId) {
      this.deleteEntity(entityId);
    } else {
      let existingItems = this.getItems();
      let placed = false;
      let xPos, yPos;

      while (!placed) {
        xPos = utilities.rand(this.params.width);
        yPos = utilities.rand(this.params.height);
        let spaceFree = true;
        existingItems.forEach((existingItem) => {
          let existingPos = existingItem.getPosition();
          if (existingPos.x === xPos && existingPos.y === yPos) {
            spaceFree = false;
          }
        });
        placed = spaceFree;
      }

      let newItem = new item(this.guid, {
        xPos,
        yPos,
      });
      this.entities.items.set(newItem.getGUID(), newItem);
      button.classList.add('item-active');
      button.dataset.entityId = newItem.getGUID();
    }
  }

  showCreatureStatus(creature) {
    if (!this.params.showStatus) {
      return;
    }

    let status = document.createElement('p');
    status.classList.add('status');
    status.innerHTML = `Creature: ${creature.getGUID()}`;

    const motives = creature.getMotives();
    for (let motive in motives) {
      let span = document.createElement('span');
      span.classList.add('status-item');
      let output = document.createElement('output');
      span.innerHTML = `${motive}: `;
      span.appendChild(output);
      status.appendChild(document.createElement('br'));
      status.appendChild(span);
      creature.setOutputEl(motive, output);
    }

    World.goalOutputs.forEach((item) => {
      let span = document.createElement('span');
      span.classList.add('status-item');
      let output = document.createElement('output');
      span.innerHTML = `${item}: `;
      span.appendChild(output);
      status.appendChild(document.createElement('br'));
      status.appendChild(span);
      creature.setOutputEl(item, output);
    });

    World.statusOutputs.forEach((item) => {
      let span = document.createElement('span');
      span.classList.add('status-item');
      let output = document.createElement('output');
      span.innerHTML = `${item}: `;
      span.appendChild(output);
      status.appendChild(document.createElement('br'));
      status.appendChild(span);
      creature.setOutputEl(item, output);
    });

    this.elements.statusWrapper.appendChild(status);
  }

  showCreatureSliders(creature) {
    if (!this.params.showSliders) {
      return;
    }

    let sliders = document.createElement('fieldset');
    sliders.classList.add('sliders');

    const motives = creature.getMotives();
    for (let motive in motives) {
      let span = document.createElement('span');
      span.classList.add('slider-item');
      let slider = document.createElement('input');
      slider.setAttribute('type', 'range');
      slider.setAttribute('min', 0);
      slider.setAttribute('max', this.params.maxMotive);
      slider.setAttribute('step', 1);
      slider.value = motives[motive];
      span.innerHTML = `${motive}: `;
      span.appendChild(slider);
      sliders.appendChild(span);
      creature.setOutputEl(`slider-${motive}`, slider);

      slider.addEventListener('change', (e) => {
        creature.setMotive(motive, e.target.value);
      });
    }

    this.elements.statusWrapper.appendChild(sliders);
  }

  showCreaturePersonality(creature) {
    if (!this.params.showPersonality) {
      return;
    }

    let personality = document.createElement('p');
    const personalityValues = creature.getPersonalityValues();
    for (let value in personalityValues) {
      let span = document.createElement('span');
      span.innerHTML = `${value}: ${personalityValues[value]}`;
      personality.appendChild(span);
      personality.appendChild(document.createElement('br'));
    }

    this.elements.statusWrapper.appendChild(personality);

    let favorites = document.createElement('p');
    const favoriteValues = creature.getFavorites();
    for (let value in favoriteValues) {
      let span = document.createElement('span');
      span.innerHTML = `${value}: ${favoriteValues[value]}`;
      favorites.appendChild(span);
      favorites.appendChild(document.createElement('br'));
    }

    this.elements.statusWrapper.appendChild(favorites);
  }

  updateCreatureStatus(creature) {
    if (!this.params.showStatus) {
      return;
    }

    const status = creature.getStatus();
    const outputs = creature.getOutputs();
    for (let motive in status.motives) {
      if (status.motives.hasOwnProperty(motive)) {
        creature.setOutput(motive, status.motives[motive]);
      }
    }

    World.statusOutputs.forEach((item) => {
      if (outputs.hasOwnProperty(item)) {
        creature.setOutput(item, status[item]);
      }
    });

    const goal = creature.getCurrentGoal();
    creature.setOutput('currentGoal', goal);

    const goals = creature.getGoals();
    creature.setOutput('goals', goals);
  }

  updateCreatureSliders(creature) {
    if (!this.params.showSliders) {
      return;
    }

    const status = creature.getStatus();
    for (let motive in status.motives) {
      if (status.motives.hasOwnProperty(motive)) {
        creature.setOutput(`slider-${motive}`, status.motives[motive], true);
      }
    }
  }

  displayEntity(icon) {
    this.elements.canvasWrapper.appendChild(icon);
  }

  moveEntity(icon, position) {
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
      button.dataset.entityId = '';
      button.classList.remove('item-active');
    }
    this.entities[type].get(id).outputs.icon.remove();
    this.entities[type].delete(id);
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

  getEntities() {
    return this.entities;
  }

  getItems() {
    return this.entities.items;
  }

  getBounds() {
    return { x: this.params.width, y: this.params.height };
  }
}
