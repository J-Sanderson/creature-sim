const utilities = {
  generateGUID: function () {
    return (
      utilities.S4() +
      utilities.S4() +
      "-" +
      utilities.S4() +
      "-" +
      utilities.S4() +
      "-" +
      utilities.S4() +
      "-" +
      utilities.S4() +
      utilities.S4() +
      utilities.S4()
    );
  },
  S4: function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  },
  rand: function (max) {
    return Math.floor(Math.random() * max);
  },
};

const goals = {
  goalWander: {
    filter: function (self) {
      // nothing else should be a priority
      // delete me if something else comes up.
      if (self.getPriority() === "none") {
        return 1;
      }
      return -1;
    },
    execute: function (self) {
      self.plans.planWander(self);
    },
  },
  goalEat: {
    filter: function (self) {
      // creature is hungry or running the eat plan
      if (
        self.getPriority() === "fullness" ||
        self.status.plan === Creature.planList.eat
      ) {
        return 1;
      }
      return 3;
    },
    execute: function (self) {
      if (self.getMotive("fullness") >= self.getMaxMotive()) {
        self.deleteGoal(Creature.goalList.eat);
      }
      let goalTokens = self.getGoalTokens();
      if (!goalTokens[Creature.goalList.eat]) {
        return;
      }

      let target = goalTokens[Creature.goalList.eat].target;
      if (!target) {
        self.plans.planSeekItem(
          self,
          Entity.adjectiveList.tasty,
          Creature.motiveIcons.hunger,
          Creature.goalList.eat
        );
      } else {
        if (self.queries.amIOnItem(self, target)) {
          self.plans.planEat(self);
        } else {
          self.plans.planMoveToItem(self, target, Creature.goalList.eat);
        }
      }
    },
  },
  goalDrink: {
    filter: function (self) {
      // creature is thirsty or running the drink plan
      if (
        self.getPriority() === "hydration" ||
        self.status.plan === Creature.planList.drink
      ) {
        return 1;
      }
      return 3;
    },
    execute: function (self) {
      if (self.getMotive("hydration") >= self.getMaxMotive()) {
        self.deleteGoal(Creature.goalList.drink);
      }
      let goalTokens = self.getGoalTokens();
      if (!goalTokens[Creature.goalList.drink]) {
        return;
      }

      let target = goalTokens[Creature.goalList.drink].target;
      if (!target) {
        self.plans.planSeekItem(
          self,
          Entity.adjectiveList.wet,
          Creature.motiveIcons.thirst,
          Creature.goalList.drink
        );
      } else {
        if (self.queries.amIOnItem(self, target)) {
          self.plans.planDrink(self);
        } else {
          self.plans.planMoveToItem(self, target, Creature.goalList.drink);
        }
      }
    },
  },
  goalSleep: {
    filter: function (self) {
      // creature is tired or running the sleep plan
      if (
        self.getPriority() === "energy" ||
        self.status.plan === Creature.planList.sleep
      ) {
        return 1;
      }
      return 3;
    },
    execute: function (self) {
      if (self.getMotive("energy") >= self.getMaxMotive()) {
        self.deleteGoal(Creature.goalList.sleep);
      }
      let goalTokens = self.getGoalTokens();
      if (!goalTokens[Creature.goalList.sleep]) {
        return;
      }

      let target = goalTokens[Creature.goalList.sleep].target;
      if (!target) {
        self.plans.planSeekItem(
          self,
          Entity.adjectiveList.restful,
          Creature.motiveIcons.tired,
          Creature.goalList.sleep
        );
      } else {
        if (self.queries.amIOnItem(self, target)) {
          self.plans.planSleep(self);
        } else {
          self.plans.planMoveToItem(self, target, Creature.goalList.sleep);
        }
      }
    },
  },
  goalBePetted: {
    filter: function (self) {
      return 1;
    },
    execute: function (self) {
      if (
        self.status.state === Creature.stateList.drink ||
        self.status.state === Creature.stateList.eat ||
        self.status.state === Creature.stateList.sleep ||
        self.status.state === Creature.stateList.petAnnoyed
      ) {
        self.plans.planPetAnnoyed(self);
      } else {
        self.plans.planPetHappy(self);
      }
    },
  },
};

const plans = {
  planWander: function (self) {
    self.setPlan(Creature.planList.wander);
    const position = self.getPosition();

    const directions = [
      { dx: -1, dy: -1 }, // NW
      { dx: 0, dy: -1 }, // N
      { dx: 1, dy: -1 }, // NE
      { dx: 1, dy: 0 }, // E
      { dx: 1, dy: 1 }, // SE
      { dx: 0, dy: 1 }, // S
      { dx: -1, dy: 1 }, // SW
      { dx: -1, dy: 0 }, // W
    ];
    const bounds = self.getBounds();
    let validDirections = [];

    directions.forEach((direction) => {
      const newX = position.x + direction.dx;
      const newY = position.y + direction.dy;
      if (newX >= 0 && newX < bounds.x && newY >= 0 && newY < bounds.y) {
        validDirections.push(direction);
      }
    });

    if (validDirections.length > 0) {
      const randomDirection = Math.floor(
        Math.random() * validDirections.length
      );
      const { dx, dy } = validDirections[randomDirection];

      const newX = position.x + dx;
      const newY = position.y + dy;

      self.states.stateMoveRandomly(self, { x: newX, y: newY });
    } else {
      console.error("No valid movement direction available");
    }
  },
  planSeekItem: function (self, adjective, motive, goal) {
    self.setPlan(Creature.planList.seekItem);

    const position = self.getPosition();
    const world = worldManager.getWorld(self.world);
    const entities = world.getEntities();

    let interestingItems = [];
    entities.items.forEach((item) => {
      if (item.adjectives.includes(adjective)) {
        interestingItems.push(item);
      }
    });

    // get the closest of these
    let minDistance = Infinity;
    let closestItem = null;
    interestingItems.forEach((item) => {
      const itemPos = item.getPosition();
      const distance = Math.sqrt(
        (itemPos.x - itemPos.x) ** 2 + (position.y - position.y) ** 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      let tokens = self.getGoalTokens();
      if (tokens.hasOwnProperty(goal)) {
        tokens[goal].setTarget(closestItem.guid);
      }
    }

    const itemPos = closestItem === null ? null : closestItem.getPosition();
    self.states.stateSeekItem(self, motive, itemPos);
  },
  planMoveToItem: function (self, id, goal) {
    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      self.deleteGoal(goal);
    }
    const itemPos = item.getPosition();
    self.states.stateMoveToItem(self, itemPos);
  },
  planDrink: function (self) {
    self.setPlan(Creature.planList.drink);
    const hydration = self.getMotive("hydration");
    const maxVal = self.getMaxMotive();
    if (hydration >= maxVal) {
      return;
    }
    self.states.stateDrink(self, hydration, maxVal);
  },
  planEat: function (self) {
    const motives = self.getMotives();
    if (!motives.hasOwnProperty("fullness")) {
      console.error("Error: no fullness motive found");
      return;
    }
    self.setPlan(Creature.planList.eat);
    if (motives.hydration < 10) {
      self.addGoal(Creature.goalList.drink, { priority: 1, suspended: false });
      self.suspendGoal(Creature.goalList.eat);
    }
    const maxVal = self.getMaxMotive();
    if (motives.fullness >= maxVal) {
      return;
    }
    self.states.stateEat(self, motives, maxVal);
  },
  planSleep: function (self) {
    const motives = self.getMotives();
    if (!motives.hasOwnProperty("energy")) {
      console.error("Error: no energy motive found");
      return;
    }
    self.setPlan(Creature.planList.sleep);
    if (motives.hydration < 10) {
      self.addGoal(Creature.goalList.drink, { priority: 1, suspended: false });
      self.suspendGoal(Creature.goalList.sleep);
    }
    if (motives.fullness < 10) {
      self.addGoal(Creature.goalList.eat, { priority: 1, suspended: false });
      self.suspendGoal(Creature.goalList.sleep);
    }
    const maxVal = self.getMaxMotive();
    if (motives.energy >= maxVal) {
      return;
    }
    self.states.stateSleep(self, motives.energy, maxVal);
  },
  planPetHappy: function (self) {
    self.setPlan(Creature.planList.petHappy);
    if (
      self.queries.amIHungry(self) ||
      self.queries.amIThirsty(self) ||
      self.queries.amITired(self)
    ) {
      let goalTokens = self.getGoalTokens();
      if (!goalTokens[Creature.goalList.pet]) {
        console.error(
          `Error: no relevant goal token found for ${Creature.goalList.pet}`
        );
      }
      goalTokens[Creature.goalList.pet].decrementTicks();
      if (goalTokens[Creature.goalList.pet].getTicks() <= 0) {
        self.deleteGoal(Creature.goalList.pet);
      }
    }
    self.states.statePetHappy(self);
  },
  planPetAnnoyed: function (self) {
    self.setPlan(Creature.planList.petAnnoyed);
    let goalTokens = self.getGoalTokens();
    if (!goalTokens[Creature.goalList.pet]) {
      console.error(
        `Error: no relevant goal token found for ${Creature.goalList.pet}`
      );
    }
    goalTokens[Creature.goalList.pet].decrementTicks();
    if (goalTokens[Creature.goalList.pet].getTicks() <= 0) {
      self.deleteGoal(Creature.goalList.pet);
    }
    self.states.statePetAnnoyed(self);
  },
};

const states = {
  stateMoveRandomly: function (self, pos) {
    self.setState(Creature.stateList.wander);
    self.showMotive("");
    self.setXPosition(pos.x);
    self.setYPosition(pos.y);

    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  },
  stateSeekItem: function (self, motive) {
    self.setState(Creature.stateList.seekItem);
    self.showMotive(motive);
  },
  stateMoveToItem(self, itemPos) {
    self.setState(Creature.stateList.moveToItem);
    self.showMotive(Creature.motiveIcons.movingToTarget);

    // move toward the item
    const position = self.getPosition();
    if (itemPos.x > position.x) {
      self.setXPosition(position.x + 1);
    }
    if (itemPos.x < position.x) {
      self.setXPosition(position.x - 1);
    }
    if (itemPos.y > position.y) {
      self.setYPosition(position.y + 1);
    }
    if (itemPos.y < position.y) {
      self.setYPosition(position.y - 1);
    }
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  },
  stateDrink(self, hydration, maxVal) {
    const item = self.queries.getItemFromWorld(self, self.getGoalTokens()[Creature.goalList.drink].target);
    if (item) {
      const amount = item.getMotive("amount");
      if (amount > 0) {
        self.setState(Creature.stateList.drink);
        self.showMotive(Creature.motiveIcons.drink);
        const transfer = 20;
        let newVal = (hydration += transfer);
        if (newVal > maxVal) {
          newVal = maxVal;
        }
        self.setMotive("hydration", newVal);
        item.setMotive("amount", amount - transfer);
      } else {
        const world = worldManager.getWorld(self.world);
        world.deleteEntity(item.getGUID());
        self.deleteGoal(Creature.goalList.drink);
      }
    } else {
      self.deleteGoal(Creature.goalList.drink);
    }
  },
  stateEat(self, motives, maxVal) {
    const item = self.queries.getItemFromWorld(self, self.getGoalTokens()[Creature.goalList.eat].target);

    if (item) {
      const amount = item.getMotive("amount");
      if (amount > 0) {
        self.setState(Creature.stateList.eat);
        self.showMotive(Creature.motiveIcons.eat);
        const transfer = 10;
        let newVal = (motives.fullness += transfer);
        if (newVal > maxVal) {
          newVal = maxVal;
        }
        self.setMotive("fullness", newVal);
        item.setMotive("amount", amount - transfer);
        if (motives.hydration > 0) {
          self.setMotive("hydration", motives.hydration - 1);
        }
      } else {
        const world = worldManager.getWorld(self.world);
        world.deleteEntity(item.getGUID());
        self.deleteGoal(Creature.goalList.eat);
      }
    } else {
      self.deleteGoal(Creature.goalList.eat);
    }
  },
  stateSleep(self, energy, maxVal) {
    self.setState(Creature.stateList.sleep);
    self.showMotive(Creature.motiveIcons.sleep);
    let newVal = (energy += 1);
    if (newVal > maxVal) {
      newVal = maxVal;
    }
    self.setMotive("energy", newVal);
  },
  statePetHappy(self) {
    self.setState(Creature.stateList.petHappy);
    self.showMotive(Creature.motiveIcons.petHappy);
  },
  statePetAnnoyed(self) {
    self.setState(Creature.stateList.petAnnoyed);
    self.showMotive(Creature.motiveIcons.petAnnoyed);
  },
};

const queries = {
  amIOnItem(self, id) {
    if (!id) {
      return false;
    }

    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      return false;
    }

    const itemPos = item.getPosition();
    return (
      self.status.position.x === itemPos.x &&
      self.status.position.y === itemPos.y
    );
  },
  amIHungry(self) {
    return self.getMotive("fullness") < self.maxMotive / 2;
  },
  amIThirsty(self) {
    return self.getMotive("hydration") < self.maxMotive / 2;
  },
  amITired(self) {
    return self.getMotive("energy") < self.maxMotive / 5;
  },
  getItemFromWorld(self, id) {
    const world = worldManager.getWorld(self.world);
    const items = world.getItems();
    return items.get(id);
  },
};

class WorldManager {
  constructor() {
    this.worlds = new Map();
  }

  addWorld(worldId, worldInstance) {
    this.worlds.set(worldId, worldInstance);
  }

  getWorld(worldId) {
    return this.worlds.get(worldId);
  }

  removeWorld(worldId) {
    this.worlds.delete(worldId);
  }
}

const worldManager = new WorldManager();

class World {
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

  static statusOutputs = ["goalTokens", "currentGoal", "plan", "state"];

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
    let canvasWrapper = document.createElement("div");
    canvasWrapper.classList.add("world-wrapper");
    this.elements.root.appendChild(canvasWrapper);
    this.elements.canvasWrapper = canvasWrapper;
    let canvas = document.createElement("canvas");
    canvas.classList.add("world-canvas");
    this.elements.canvasWrapper.appendChild(canvas);
    this.elements.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.drawWorld();

    let toybox = document.createElement("div");
    toybox.classList.add("toybox");
    this.elements.root.appendChild(toybox);
    this.elements.toybox = toybox;

    if (this.params.showStatus) {
      let statusWrapper = document.createElement("div");
      statusWrapper.classList.add("status-wrapper");
      statusWrapper.innerHTML = "<p>Status</p>";
      this.elements.root.appendChild(statusWrapper);
      this.elements.statusWrapper = statusWrapper;
    }

    [Water, Food, Bed].forEach((item) => {
      let button = document.createElement("button");
      button.innerHTML = item.icon;
      button.style["font-size"] = `${this.params.cellSize}px`;
      button.addEventListener("click", () => {
        let entityId = button.dataset.entityId;
        if (entityId) {
          this.deleteEntity(entityId);
        } else {
          let newItem = new item(this.guid, {
            xPos: utilities.rand(this.params.width),
            yPos: utilities.rand(this.params.height),
          });
          this.entities.items.set(newItem.getGUID(), newItem);
          button.classList.add("item-active");
          button.dataset.entityId = newItem.getGUID();
        }
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
        this.showCreaturePersonality(creature)
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
        this.ctx.strokeStyle = "#000";
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

  showCreatureStatus(creature) {
    if (!this.params.showStatus) {
      return;
    }

    let status = document.createElement("p");
    status.classList.add("status");
    status.innerHTML = `Creature: ${creature.getGUID()}`;

    const motives = creature.getMotives();
    for (let motive in motives) {
      let span = document.createElement("span");
      span.classList.add("status-item");
      let output = document.createElement("output");
      span.innerHTML = `${motive}: `;
      span.appendChild(output);
      status.appendChild(document.createElement("br"));
      status.appendChild(span);
      creature.setOutputEl(motive, output);
    }

    World.statusOutputs.forEach((item) => {
      let span = document.createElement("span");
      span.classList.add("status-item");
      let output = document.createElement("output");
      span.innerHTML = `${item}: `;
      span.appendChild(output);
      status.appendChild(document.createElement("br"));
      status.appendChild(span);
      creature.setOutputEl(item, output);
    });

    this.elements.statusWrapper.appendChild(status);
  }

  showCreatureSliders(creature) {
    if (!this.params.showSliders) {
      return;
    }

    let sliders = document.createElement("fieldset");
    sliders.classList.add("sliders");

    const motives = creature.getMotives();
    for (let motive in motives) {
      let span = document.createElement("span");
      span.classList.add("slider-item");
      let slider = document.createElement("input");
      slider.setAttribute("type", "range");
      slider.setAttribute("min", 0);
      slider.setAttribute("max", this.params.maxMotive);
      slider.setAttribute("step", 1);
      slider.value = motives[motive];
      span.innerHTML = `${motive}: `;
      span.appendChild(slider);
      sliders.appendChild(span);
      creature.setOutputEl(`slider-${motive}`, slider);

      slider.addEventListener("change", (e) => {
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
      personality.appendChild(document.createElement("br"));
    }
    
    this.elements.statusWrapper.appendChild(personality);
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

  deleteEntity(id, type = "items") {
    let button = this.elements.toybox.querySelector(`[data-entity-id="${id}"]`);
    if (button) {
      button.dataset.entityId = "";
      button.classList.remove("item-active");
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

class GoalToken {
  static defaults = {
    priority: 1,
    suspended: false,
    ticks: -1,
    target: null,
  };

  constructor(name, params = {}) {
    if (!name) {
      console.error("GoalToken must have a valid name");
      return;
    }
    this.name = name;

    for (let param in GoalToken.defaults) {
      this[param] = params.hasOwnProperty(param)
        ? params[param]
        : GoalToken.defaults[param];
    }
  }

  suspend() {
    this.suspended = true;
  }

  unsuspend() {
    this.suspended = false;
  }

  getIsSuspended() {
    return this.suspended;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  getPriority() {
    return this.priority;
  }

  decrementTicks() {
    if (this.ticks > 0) {
      this.ticks--;
    }
  }

  getTicks() {
    return this.ticks;
  }

  setTarget(target) {
    this.target = target;
  }
}

class Entity {
  static adjectiveList = {
    inanimate: "inanimate",
    animate: "animate",
    tasty: "tasty",
    wet: "wet",
    restful: "restful",
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
    this.adjectives = [];

    this.maxMotive = worldManager.getWorld(this.world).getParam("maxMotive");
    this.status = {
      position: {
        x: params.hasOwnProperty("xPos") ? params.xPos : 0,
        y: params.hasOwnProperty("yPos") ? params.yPos : 0,
      },
      motives: {},
    };

    this.init();
  }

  init() {
    let world = worldManager.getWorld(this.world);
    let cellSize = world.getParam("cellSize");
    let lineWidth = world.getParam("lineWidth");

    let icon = document.createElement("div");
    icon.classList.add("entity");
    icon.style.width = `${cellSize}px`;
    icon.style.height = `${cellSize}px`;
    icon.style.left = `${this.status.position.x * cellSize + lineWidth}px`;
    icon.style.top = `${this.status.position.y * cellSize + lineWidth}px`;
    if (this instanceof Creature) {
      icon.classList.add("creature");
      let bubble = document.createElement("div");
      bubble.classList.add("bubble");
      icon.appendChild(bubble);
      this.outputs.bubble = bubble;
    }
    this.outputs.icon = icon;

    world.displayEntity(this.outputs.icon);
  }

  getGUID() {
    return this.guid;
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
      console.error("Invalid motive");
      return;
    }
    this.status.motives[motive] = value;
  }

  setIcon() {
    let world = worldManager.getWorld(this.world);
    let cellSize = world.getParam("cellSize");
    let span = document.createElement("span");
    span.innerHTML = this.icon ? this.icon : "&#x2753;";
    this.outputs.icon.prepend(span);
    this.outputs.icon.style["font-size"] = `${cellSize}px`;
    this.outputs.icon.style["z-index"] = this.order;
  }

  setXPosition(pos) {
    this.status.position.x = pos;
  }

  setYPosition(pos) {
    this.status.position.y = pos;
  }
}

class Item extends Entity {
  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(Entity.adjectiveList.inanimate);
  }
}

class Water extends Item {
  static icon = "&#x1F4A7;";

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(Entity.adjectiveList.wet);
    this.icon = Water.icon;

    this.status.motives.amount = this.maxMotive * 2.5;

    this.setIcon();
  }
}

class Food extends Item {
  static icon = "&#x1F969;";

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(Entity.adjectiveList.tasty);
    this.icon = Food.icon;

    this.status.motives.amount = this.maxMotive * 1.5;

    this.setIcon();
  }
}

class Bed extends Item {
  static icon = "&#x1F6CF;";

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(Entity.adjectiveList.restful);
    this.icon = Bed.icon;

    this.setIcon();
  }
}

class Creature extends Entity {
  static goalList = {
    drink: "goalDrink",
    eat: "goalEat",
    sleep: "goalSleep",
    wander: "goalWander",
    pet: "goalBePetted",
  };

  static planList = {
    wander: "planWander",
    seekItem: "planSeekItem",
    moveToItem: "planMoveToItem",
    sleep: "planSleep",
    eat: "planEat",
    drink: "planDrink",
    petHappy: "planPetHappy",
    petAnnoyed: "planPetAnnoyed",
  };

  static stateList = {
    wander: "stateMoveRandomly",
    seekItem: "stateSeekItem",
    moveToItem: "stateMoveToItem",
    sleep: "stateSleep",
    eat: "stateEat",
    drink: "stateDrink",
    petHappy: "statePetHappy",
    petAnnoyed: "statePetAnnoyed",
  };

  static motiveIcons = {
    thirst: "&#x1F4A7;",
    hunger: "&#x1F374;",
    tired: "&#x1F634;",
    drink: "&#x1F445;",
    eat: "&#x1F37D;",
    sleep: "&#x1F4A4;",
    petHappy: "&#x2764;",
    petAnnoyed: "&#x1F620;",
    movingToTarget: "&#x1F43E;",
  };
  
  static personalityValues = [
    'liveliness',
    'patience',
    'naughtiness',
    'metabolism',
  ];

  constructor(world, params = {}) {
    super(world, params);
    this.order = 2;
    this.adjectives.push(Entity.adjectiveList.animate);

    ["fullness", "hydration", "energy"].forEach((motive) => {
      this.status.motives[motive] = utilities.rand(this.maxMotive);
    });

    this.status.goalTokens = {};
    this.addGoal(Creature.goalList.wander, { priority: 1, suspended: false });
    this.status.currentGoal = Creature.goalList.wander;
    this.status.plan = Creature.planList.moving;
    this.status.state = Creature.stateList.wander;
    
    this.personality = {
      values: {},
    };
    let maxPersonalityValue = 100;
    Creature.personalityValues.forEach(value => {
      this.personality.values[value] = utilities.rand(maxPersonalityValue);
    });
    this.personality.decayThresholds = {
      fullness: this.getPersonalityValues().metabolism / 100,
      energy: 1 - (1 - (this.getPersonalityValues().metabolism / 100)) * (1 + (this.getPersonalityValues().liveliness / 100)), 
    };
    this.personality.decayThresholds.energy =  Math.max(0, Math.min(1, this.personality.decayThresholds.energy));

    this.states = states;
    this.plans = plans;
    this.goals = goals;
    this.queries = queries;

    this.outputs.motives = {};

    this.icon = "&#x1F415;";
    this.setIcon();

    this.eventHandlers.petStart = () => {
      this.addGoal(Creature.goalList.pet, {
        priority: 1,
        suspended: false,
        ticks: 1,
      });
    };
    this.outputs.icon.addEventListener(
      "mousedown",
      this.eventHandlers.petStart
    );

    this.eventHandlers.petStop = () => {
      this.deleteGoal(Creature.goalList.pet);
    };
    this.outputs.icon.addEventListener("mouseup", this.eventHandlers.petStop);
  }

  update() {
    this.metabolismManager();
    this.goalManager();
  }

  metabolismManager() {
    const personalityValues = this.getPersonalityValues();
    const decayThresholds = this.getDecayThresholds();
    
    // fullness decay
    if(this.status.state !== Creature.stateList.eat) {
      if (
        (this.status.state !== Creature.stateList.sleep ||
          Math.random() > 0.75) &&
        this.status.motives.fullness > 0
      ) {
        if (Math.random() < decayThresholds.fullness) {
          this.setMotive('fullness',  this.status.motives.fullness - 1);
        }
      }
    }
    
    // hydration decay
    if(this.status.state !== Creature.stateList.drink) {
      if (
        (this.status.state !== Creature.stateList.sleep ||
          Math.random() > 0.75) &&
        this.status.motives.hydration > 0 &&
        Math.random() > 0.5
      ) {
        this.status.motives.hydration --;
      }
    }
    
    // energy decay
    if(this.status.state !== Creature.stateList.sleep && this.status.motives.energy > 0) {
      if (Math.random() < decayThresholds.energy) {
        this.setMotive('energy', this.status.motives.energy - 1);
      }
    }

    const priority = this.getPriority();
    switch (priority) {
      case "fullness":
        if (!(Creature.goalList.eat in this.status.goalTokens)) {
          this.addGoal(
            Creature.goalList.eat,
            { priority: 1, suspended: false },
            false
          );
        }
        break;
      case "hydration":
        if (!(Creature.goalList.drink in this.status.goalTokens)) {
          this.addGoal(
            Creature.goalList.drink,
            { priority: 1, suspended: false },
            false
          );
        }
        break;
      case "energy":
        if (!(Creature.goalList.sleep in this.status.goalTokens)) {
          this.addGoal(
            Creature.goalList.sleep,
            { priority: 1, suspended: false },
            false
          );
        }
        break;
      default:
    }
  }

  goalManager() {
    for (let goalToken in this.status.goalTokens) {
      if (goalToken) {
        const priority = this.goals[goalToken].filter(this);
        if (priority < 0) {
          delete this.status.goalTokens[goalToken];
        } else {
          this.status.goalTokens[goalToken].setPriority(priority);
        }
      }
    }
    let current = this.status.goalTokens[this.status.currentGoal];
    if (!current || current.getIsSuspended()) {
      if (Object.keys(this.status.goalTokens).length) {
        // find another goal to execute
        let priority = -1;
        let newGoal = "";
        for (let goal in this.status.goalTokens) {
          let goalPriority = this.status.goalTokens[goal].getPriority();
          if (
            !this.status.goalTokens[goal].getIsSuspended() &&
            goalPriority > priority
          ) {
            priority = goalPriority;
            newGoal = goal;
          }
        }
        if (!newGoal) {
          for (let goal in this.status.goalTokens) {
            let goalPriority = this.status.goalTokens[goal].getPriority();
            if (goalPriority > priority) {
              priority = goalPriority;
              newGoal = goal;
            }
          }
        }
        if (this.status.goalTokens[newGoal].getIsSuspended()) {
          this.unsuspendGoal(newGoal);
        }
        this.status.currentGoal = newGoal;
      } else {
        // no goal tokens left, add the basic wander goal
        this.addGoal(Creature.goalList.wander, {
          priority: 1,
          suspended: false,
        });
      }
    }
    this.goals[this.status.currentGoal].execute(this);
  }

  showMotive(motive) {
    if (!motive) {
      this.outputs.bubble.style.display = "none";
      return;
    }
    this.outputs.bubble.innerHTML = `<span>${motive}</span>`;
    this.outputs.bubble.style.display = "block";
  }

  getPriority() {
    let priority = "none";
    if (this.queries.amITired(this)) {
      priority = "energy";
    }
    if (this.queries.amIHungry(this)) {
      priority = "fullness";
    }
    if (this.queries.amIThirsty(this)) {
      priority = "hydration";
    }
    return priority;
  }

  getOutputs() {
    return this.outputs;
  }

  getGoalTokens() {
    return this.status.goalTokens;
  }
  
  getPersonalityValues() {
    return this.personality.values;
  }
  
  getPersonalityValue(value) {
    if (!(value in this.personality.values)) {
      console.error(`Error: no ${value} personality value found`);
      return;
    }
    return this.personality[value];
  }
  
  getDecayThresholds() {
    return this.personality.decayThresholds;
  }

  setState(state) {
    this.status.state = state;
  }

  setPlan(plan) {
    this.status.plan = plan;
  }

  addGoal(name, goal, isCurrent = true) {
    if (this.status.goalTokens.hasOwnProperty(name)) {
      return;
    }
    if (isCurrent) {
      this.status.currentGoal = name;
    }
    this.status.goalTokens[name] = new GoalToken(name, goal);
  }

  suspendGoal(goalName) {
    let toSuspend = this.status.goalTokens[goalName];
    if (toSuspend) {
      toSuspend.suspend();
    }
  }

  unsuspendGoal(goalName) {
    let toUnsuspend = this.status.goalTokens[goalName];
    if (toUnsuspend) {
      toUnsuspend.unsuspend();
    }
  }

  deleteGoal(goalName) {
    delete this.status.goalTokens[goalName];
  }

  setOutputEl(type, el) {
    this.outputs[type] = el;
  }

  setOutput(type, val, setVal = false) {
    if (setVal) {
      this.outputs[type].value = val;
    } else {
      this.outputs[type].innerHTML = JSON.stringify(val);
    }
  }
}

let worldEl = document.getElementById("world");
if (worldEl) {
  const world = new World(worldEl, {
    speed: 750,
    width: 10,
    height: 10,
    cellSize: 70,
    showStatus: true,
    showSliders: true,
    showPersonality: true,
  });
}
