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

class Goal {
  static defaults = {
    priority: 1,
    suspended: false,
    ticks: -1,
    target: null,
    calledBy: null,
  };

  constructor(params = {}) {
    for (let param in Goal.defaults) {
      this[param] = params.hasOwnProperty(param)
        ? params[param]
        : Goal.defaults[param];
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

  getCalledBy() {
    return this.calledBy;
  }
}

class GoalWander extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();
    let priority = 7;

    for (let motive in motives) {
      if (motives[motive] <= maxMotive / 10) {
        return -1;
      }
    }

    const livelinessFactor = Math.min(
      1,
      personalityValues.liveliness / maxMotive
    );
    const priorityModifier = Math.floor(3 * livelinessFactor);
    priority -= priorityModifier;

    return priority;
  }
  execute(self) {
    if (Math.random() < self.getDecayThreshold("wander")) {
      this.decrementTicks();
    }
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(Creature.goalList.wander);
    }

    self.plans.planWander(self);
  }
}

class GoalEat extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();
    const plan = self.getPlan();
    const nearbyFood = self.queries.getItemsByAdjective(
      self,
      Entity.adjectiveList.tasty
    );

    let priority = 6;

    if (plan === Creature.planList.eat || motives.fullness <= maxMotive / 10) {
      priority = 1;
    }

    if (nearbyFood.length) {
      if (motives.fullness <= maxMotive / 2) {
        priority = 4;
      } else if (motives.fullness <= maxMotive / 1.53) {
        priority = 5;
      }
    }

    const metabolismFactor = Math.min(
      1,
      personalityValues.metabolism / maxMotive
    );
    const priorityModifier = Math.floor(3 * metabolismFactor);
    priority = Math.max(1, priority - priorityModifier);

    return priority;
  }
  execute(self) {
    if (self.getMotive("fullness") >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(Creature.goalList.eat);
    }
    let goals = self.getGoals();
    if (!goals[Creature.goalList.eat]) {
      return;
    }

    let target = goals[Creature.goalList.eat].target;
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
  }
}

class GoalDrink extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();
    const plan = self.getPlan();
    const nearbyWater = self.queries.getItemsByAdjective(
      self,
      Entity.adjectiveList.wet
    );

    let priority = 6;

    if (
      plan === Creature.planList.drink ||
      motives.hydration <= maxMotive / 10
    ) {
      priority = 1;
    }

    if (nearbyWater.length) {
      if (motives.hydration <= maxMotive / 2) {
        priority = 4;
      } else if (motives.hydration <= maxMotive / 1.53) {
        priority = 5;
      }
    }

    const livelinessFactor = Math.min(
      1,
      personalityValues.liveliness / maxMotive
    );
    const priorityModifier = Math.floor(3 * livelinessFactor);
    priority = Math.max(1, priority - priorityModifier);

    return priority;
  }
  execute(self) {
    if (self.getMotive("hydration") >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(Creature.goalList.drink);
    }
    let goals = self.getGoals();
    if (!goals[Creature.goalList.drink]) {
      return;
    }

    let target = goals[Creature.goalList.drink].target;
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
  }
}

class GoalSleep extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();
    const plan = self.getPlan();
    const nearbyBeds = self.queries.getItemsByAdjective(
      self,
      Entity.adjectiveList.restful
    );

    let priority = 6;

    if (plan === Creature.planList.sleep || motives.energy <= maxMotive / 10) {
      priority = 1;
    }

    if (nearbyBeds.length) {
      if (motives.energy <= maxMotive / 2) {
        priority = 4;
      } else if (motives.energy <= maxMotive / 1.53) {
        priority = 5;
      }
    }

    const livelinessFactor =
      1 - Math.min(1, personalityValues.liveliness / maxMotive);
    const priorityModifier = Math.floor(3 * livelinessFactor);
    priority = Math.max(1, priority - priorityModifier);

    return priority;
  }
  execute(self) {
    if (self.getMotive("energy") >= self.getMaxMotive()) {
      self.goalManager.deleteGoal(Creature.goalList.sleep);
    }
    let goals = self.getGoals();
    if (!goals[Creature.goalList.sleep]) {
      return;
    }

    let target = goals[Creature.goalList.sleep].target;
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
  }
}

class GoalBePetted extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    return 1;
  }
  execute(self) {
    if (
      self.status.state === Creature.stateList.drink ||
      self.status.state === Creature.stateList.eat ||
      self.status.state === Creature.stateList.sleep ||
      self.status.state === Creature.stateList.petAnnoyed
    ) {
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(Creature.goalList.pet);
      }
      self.plans.planPetAnnoyed(self);
    } else {
      if (
        self.queries.amIHungry(self) ||
        self.queries.amIThirsty(self) ||
        self.queries.amITired(self)
      ) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(Creature.goalList.pet);
        }
      }
      self.plans.planPetHappy(self);
    }
  }
}

class GoalSitAround extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();
    let priority = 7;

    for (let motive in motives) {
      if (motives[motive] <= maxMotive / 10) {
        return -1;
      }
    }

    if (motives.energy <= maxMotive / 3) {
      priority += 1;
    }

    const livelinessFactor =
      1 - Math.min(1, personalityValues.liveliness / maxMotive);
    const priorityModifier = Math.floor(3 * livelinessFactor);
    priority = Math.max(1, priority - priorityModifier);

    return priority;
  }
  execute(self) {
    if (Math.random() < self.getDecayThreshold("sitAround")) {
      this.decrementTicks();
    }
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(Creature.goalList.sitAround);
    }
    self.plans.planSitAround(self);
  }
}

class GoalKnockItemFromToybox extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const personalityValues = self.getPersonalityValues();
    const maxMotive = self.getMaxMotive();

    if (
      personalityValues.naughtiness <= maxMotive * 0.1 &&
      personalityValues.patience >= maxMotive * 0.1
    ) {
      return -1;
    }

    const goals = self.getGoals();
    const calledBy = goals[Creature.goalList.knockItemFromToybox].getCalledBy();
    if (calledBy) {
      let adj = "";
      switch (calledBy) {
        case Creature.goalList.sleep:
          adj = Entity.adjectiveList.restful;
          break;
        case Creature.goalList.eat:
          adj = Entity.adjectiveList.tasty;
          break;
        case Creature.goalList.drink:
          adj = Entity.adjectiveList.wet;
          break;
        case Creature.goalList.chewToy:
          adj = Entity.adjectiveList.chew;
          break;
        case Creature.goalList.bounceToy:
          adj = Entity.adjectiveList.bounce;
          break;
      }
      if (adj && self.queries.getItemsByAdjective(self, adj).length) {
        return -1;
      }
    }

    if (
      calledBy !== Creature.goalList.sleep &&
      calledBy !== Creature.goalList.eat &&
      calledBy !== Creature.goalList.drink &&
      personalityValues.naughtiness < maxMotive * 0.9 &&
      personalityValues.patience > maxMotive * 0.1
    ) {
      return -1;
    }

    let priority = 5;

    const patienceFactor =
      1 - Math.min(1, personalityValues.patience / maxMotive);
    const patienceModifier = Math.floor(3 * patienceFactor);
    priority -= patienceModifier;

    const naughtinessFactor = Math.min(
      1,
      personalityValues.naughtiness / maxMotive
    );
    const naughtinessModifier = Math.floor(3 * naughtinessFactor);
    priority -= naughtinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    const position = self.getPosition();
    const bounds = self.getBounds();
    if (position.y + 1 >= bounds.y) {
      self.plans.planPushItemFromToybox(self);
    } else {
      self.plans.planMoveToToybox(self);
    }
  }
}

class GoalChewToy extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const currentGoal = self.getCurrentGoal();
    if (
      this.getIsSuspended() &&
      currentGoal !== Creature.goalList.knockItemFromToybox &&
      currentGoal !== Creature.goalList.chewToy
    ) {
      return -1;
    }

    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();

    for (let motive in motives) {
      if (motives[motive] <= maxMotive * 0.1) {
        return -1;
      }
    }

    const personalityValues = self.getPersonalityValues();
    const nearbyToys = self.queries.getItemsByAdjective(
      self,
      Entity.adjectiveList.chew
    );

    if (
      !nearbyToys.length &&
      personalityValues.naughtiness < maxMotive * 0.9 &&
      personalityValues.patience > maxMotive * 0.1
    ) {
      return -1;
    }

    let priority = 7;

    const playfulnessFactor = Math.min(
      1,
      personalityValues.playfulness / maxMotive
    );
    const playfulnessModifier = Math.floor(3 * playfulnessFactor);
    priority -= playfulnessModifier;

    const livelinessFactor =
      1 - Math.min(1, personalityValues.liveliness / maxMotive);
    const livelinessModifier = Math.floor(3 * livelinessFactor);
    priority -= livelinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    let target = this.target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        Entity.adjectiveList.chew,
        null,
        Creature.goalList.chewToy
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(Creature.goalList.chewToy);
        }
        self.plans.planChewToy(self);
      } else {
        self.plans.planMoveToItem(self, target, Creature.goalList.chewToy);
      }
    }
  }
}

class GoalBounceToy extends Goal {
  constructor(params) {
    super(params);
  }
  filter(self) {
    const currentGoal = self.getCurrentGoal();
    if (
      this.getIsSuspended() &&
      currentGoal !== Creature.goalList.knockItemFromToybox &&
      currentGoal !== Creature.goalList.bounceToy
    ) {
      return -1;
    }

    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();

    for (let motive in motives) {
      if (motives[motive] <= maxMotive * 0.1) {
        return -1;
      }
    }

    const personalityValues = self.getPersonalityValues();
    const nearbyToys = self.queries.getItemsByAdjective(
      self,
      Entity.adjectiveList.bounce
    );

    if (
      !nearbyToys.length &&
      personalityValues.naughtiness < maxMotive * 0.9 &&
      personalityValues.patience > maxMotive * 0.1
    ) {
      return -1;
    }

    let priority = 7;

    const playfulnessFactor = Math.min(
      1,
      personalityValues.playfulness / maxMotive
    );
    const playfulnessModifier = Math.floor(3 * playfulnessFactor);
    priority -= playfulnessModifier;

    const livelinessFactor = Math.min(
      1,
      personalityValues.liveliness / maxMotive
    );
    const livelinessModifier = Math.floor(3 * livelinessFactor);
    priority -= livelinessModifier;

    return priority;
  }
  execute(self) {
    let target = this.target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        Entity.adjectiveList.bounce,
        null,
        Creature.goalList.bounceToy
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(Creature.goalList.bounceToy);
        }
        self.plans.planBounceToy(self);
      } else {
        self.plans.planMoveToItem(self, target, Creature.goalList.bounceToy);
      }
    }
  }
}

const goals = {
  goalWander: GoalWander,
  goalEat: GoalEat,
  goalDrink: GoalDrink,
  goalSleep: GoalSleep,
  goalBePetted: GoalBePetted,
  goalSitAround: GoalSitAround,
  goalKnockItemFromToybox: GoalKnockItemFromToybox,
  goalChewToy: GoalChewToy,
  goalBounceToy: GoalBounceToy,
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
  planSeekItem: function (self, adj, motive, goal) {
    self.setPlan(Creature.planList.seekItem);

    const position = self.getPosition();
    let interestingItems = self.queries.getItemsByAdjective(self, adj);

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
      let goals = self.getGoals();
      if (goals.hasOwnProperty(goal)) {
        goals[goal].setTarget(closestItem.guid);
      }
    } else {
      self.goalManager.suspendGoal(goal);
      self.goalManager.addGoal(self, Creature.goalList.knockItemFromToybox, {
        calledBy: goal,
      });
    }

    const itemPos = closestItem === null ? null : closestItem.getPosition();
    self.states.stateSeekItem(self, motive, itemPos);
  },
  planMoveToItem: function (self, id, goal) {
    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      self.goalManager.deleteGoal(goal);
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
      self.goalManager.addGoal(self, Creature.goalList.drink, {
        priority: 1,
        suspended: false,
      });
      self.goalManager.suspendGoal(Creature.goalList.eat);
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
      self.goalManager.addGoal(self, Creature.goalList.drink, {
        priority: 1,
        suspended: false,
      });
      self.goalManager.suspendGoal(Creature.goalList.sleep);
    }
    if (motives.fullness < 10) {
      self.goalManager.addGoal(self, Creature.goalList.eat, {
        priority: 1,
        suspended: false,
      });
      self.goalManager.suspendGoal(Creature.goalList.sleep);
    }
    const maxVal = self.getMaxMotive();
    if (motives.energy >= maxVal) {
      return;
    }
    self.states.stateSleep(self, motives.energy, maxVal);
  },
  planPetHappy: function (self) {
    self.setPlan(Creature.planList.petHappy);
    self.states.statePetHappy(self);
  },
  planPetAnnoyed: function (self) {
    self.setPlan(Creature.planList.petAnnoyed);
    self.states.statePetAnnoyed(self);
  },
  planSitAround: function (self) {
    self.setPlan(Creature.planList.sitAround);
    self.states.stateSitAround(self);
  },
  planMoveToToybox: function (self) {
    self.setPlan(Creature.planList.moveToToybox);
    self.states.stateMoveToToybox(self);
  },
  planPushItemFromToybox(self) {
    self.setPlan(Creature.planList.pushItemFromToybox);
    self.states.statePushItemFromToybox(self);
    let goals = self.getGoals();
    if (!goals[Creature.goalList.knockItemFromToybox]) {
      console.error(
        `Error: no relevant goal found for ${Creature.goalList.knockItemFromToybox}`
      );
    }

    let adj;
    let calledBy = goals[Creature.goalList.knockItemFromToybox].getCalledBy();
    switch (calledBy) {
      case "goalEat":
        adj = Entity.adjectiveList.tasty;
        break;
      case "goalDrink":
        adj = Entity.adjectiveList.wet;
        break;
      case "goalSleep":
        adj = Entity.adjectiveList.restful;
        break;
      case "goalChewToy":
        adj = Entity.adjectiveList.chew;
        break;
      case "goalBounceToy":
        adj = Entity.adjectiveList.bounce;
        break;
      default:
      // item not called by need, TODO random knocking item?
    }
    
    const nearbyItems = self.queries.getItemsByAdjective(self, adj);
    if (nearbyItems.length) {
      self.goalManager.deleteGoal(Creature.goalList.knockItemFromToybox);
      self.goalManager.unsuspendGoal(calledBy);
    } else {
      let toybox = document.querySelector(`[data-world="${self.world}"]`);
      let buttons = Array.from(toybox.querySelectorAll('button'));
      let interestingButtons = buttons.filter(button => {
        return button.dataset.adjectives.split(',').includes(adj);
      });
      if (!interestingButtons.length) {
        self.goalManager.deleteGoal(Creature.goalList.knockItemFromToybox);
        self.goalManager.unsuspendGoal(calledBy);
      }
      const button = interestingButtons[utilities.rand(interestingButtons.length - 1)];
      button.click();
    }
  },
  planChewToy(self) {
    self.setPlan(Creature.planList.chewToy);
    self.states.stateChewToy(self);
  },
  planBounceToy(self) {
    self.setPlan(Creature.planList.bounceToy);
    self.states.stateBounceToy(self);
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
    if (motive) {
      self.showMotive(motive);
    }
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
    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[Creature.goalList.drink].target
    );
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
        self.goalManager.deleteGoal(Creature.goalList.drink);
      }
    } else {
      self.goalManager.deleteGoal(Creature.goalList.drink);
    }
  },
  stateEat(self, motives, maxVal) {
    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[Creature.goalList.eat].target
    );

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
        self.goalManager.deleteGoal(Creature.goalList.eat);
      }
    } else {
      self.goalManager.deleteGoal(Creature.goalList.eat);
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
  stateSitAround(self) {
    self.setState(Creature.stateList.sitAround);
    self.showMotive(Creature.motiveIcons.sitAround);
  },
  stateMoveToToybox(self) {
    self.setState(Creature.stateList.moveToToybox);
    self.showMotive(Creature.motiveIcons.movingToTarget);
    const pos = self.getPosition();
    self.setYPosition(pos.y + 1);
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  },
  statePushItemFromToybox(self) {
    self.setState(Creature.stateList.pushItemFromToybox);
    self.showMotive(Creature.motiveIcons.pushItemFromToybox);
  },
  stateChewToy(self) {
    self.setState(Creature.stateList.chewToy);
    self.showMotive(Creature.motiveIcons.chewToy);
  },
  stateBounceToy(self) {
    self.setState(Creature.stateList.bounceToy);
    self.showMotive(Creature.motiveIcons.bounceToy);
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
    return self.getMotive("fullness") < self.getDesireThreshold("eat");
  },
  amIThirsty(self) {
    return self.getMotive("hydration") < self.getDesireThreshold("drink");
  },
  amITired(self) {
    return self.getMotive("energy") < self.getDesireThreshold("sleep");
  },
  getItemsByAdjective(self, adj) {
    const world = worldManager.getWorld(self.world);
    const entities = world.getEntities();

    let interestingItems = [];
    entities.items.forEach((item) => {
      if (item.adjectives.includes(adj)) {
        interestingItems.push(item);
      }
    });
    return interestingItems;
  },
  getItemFromWorld(self, id) {
    const world = worldManager.getWorld(self.world);
    const items = world.getItems();
    return items.get(id);
  },
};

class GoalManager {
  constructor() {
    this.goalList = {};
    this.currentGoal = "";
  }

  update(self) {
    this.updateGoalPriorities(self);
    let current = this.goalList[this.currentGoal];
    if (!current || current.getIsSuspended()) {
      // do I have other goals?
      if (Object.keys(this.goalList).length) {
        // is there another valid unsuspended goal in the list?
        let newGoal = this.getTopPriorityGoal(true);
        if (!newGoal) {
          // is there a valid suspended goal in the list?
          newGoal = this.getTopPriorityGoal();
        }
        // unsuspend if needed
        if (this.goalList[newGoal].getIsSuspended()) {
          this.unsuspendGoal(newGoal);
        }
        this.currentGoal = newGoal;
      } else {
        // no goals left, find something interesting to do
        this.findInterestingGoals(self);
      }
    }
    this.goalList[this.currentGoal].execute(self);
  }

  updateGoalPriorities(self) {
    for (let goal in this.goalList) {
      if (goal) {
        const priority = this.goalList[goal].filter(self);
        if (priority < 0) {
          delete this.goalList[goal];
        } else {
          this.goalList[goal].setPriority(priority);
        }
      }
    }
  }

  getTopPriorityGoal(excludeSuspended = false) {
    let highestPriority = Infinity;
    let highestPriorityGoal = null;

    for (let goal in this.goalList) {
      if (this.goalList.hasOwnProperty(goal)) {
        if (
          !excludeSuspended ||
          (excludeSuspended && !this.goalList[goal].getIsSuspended())
        ) {
          const priority = this.goalList[goal].getPriority();
          if (priority < highestPriority) {
            highestPriority = priority;
            highestPriorityGoal = goal;
          }
        }
      }
    }

    return highestPriorityGoal;
  }
  
  findInterestingGoals(self) {
    // expand this to make more interesting
    // currently just pushes 'idle' goals
    this.addGoal(self, Creature.goalList.wander, { ticks: 5 });
    this.addGoal(self, Creature.goalList.sitAround, { ticks: 5 });
    this.addGoal(self, Creature.goalList.chewToy, { ticks: 5 });
    this.addGoal(self, Creature.goalList.bounceToy, { ticks: 5 });
  }

  addGoal(self, name, params, isCurrent = true) {
    if (!self.goals.hasOwnProperty(name)) {
      console.error(`Error: no goal object found for ${name}`);
    }
    if (this.goalList.hasOwnProperty(name)) {
      return;
    }
    if (isCurrent) {
      this.currentGoal = name;
    }
    this.goalList[name] = new self.goals[name](params);
  }

  suspendGoal(goalName) {
    let toSuspend = this.goalList[goalName];
    if (toSuspend) {
      toSuspend.suspend();
    }
  }

  unsuspendGoal(goalName) {
    let toUnsuspend = this.goalList[goalName];
    if (toUnsuspend) {
      toUnsuspend.unsuspend();
    }
  }

  deleteGoal(goalName) {
    delete this.goalList[goalName];
  }

  getGoalList() {
    return this.goalList;
  }

  getCurrentGoal() {
    return this.currentGoal;
  }
}

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

  static statusOutputs = ["plan", "state"];
  static goalOutputs = ["goals", "currentGoal"];

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
    toybox.dataset.world = this.guid;
    this.elements.root.appendChild(toybox);
    this.elements.toybox = toybox;

    if (this.params.showStatus) {
      let statusWrapper = document.createElement("div");
      statusWrapper.classList.add("status-wrapper");
      statusWrapper.innerHTML = "<p>Status</p>";
      this.elements.root.appendChild(statusWrapper);
      this.elements.statusWrapper = statusWrapper;
    }

    [Water, Food, Bed, Bone, Ball].forEach((item) => {
      let button = document.createElement("button");
      button.innerHTML = item.icon;
      button.style["font-size"] = `${this.params.cellSize}px`;
      button.dataset.adjectives = item.adjectives;
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

    World.goalOutputs.forEach((item) => {
      let span = document.createElement("span");
      span.classList.add("status-item");
      let output = document.createElement("output");
      span.innerHTML = `${item}: `;
      span.appendChild(output);
      status.appendChild(document.createElement("br"));
      status.appendChild(span);
      creature.setOutputEl(item, output);
    });

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

    let personality = document.createElement("p");
    const personalityValues = creature.getPersonalityValues();
    for (let value in personalityValues) {
      let span = document.createElement("span");
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

    const goal = creature.getCurrentGoal();
    creature.setOutput("currentGoal", goal);

    const goals = creature.getGoals();
    creature.setOutput("goals", goals);
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

class Entity {
  static adjectiveList = {
    inanimate: "inanimate",
    animate: "animate",
    tasty: "tasty",
    wet: "wet",
    restful: "restful",
    chew: "chew",
    bounce: "bounce",
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
  static adjectives = [Entity.adjectiveList.inanimate];

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(...Item.adjectives);
  }
}

class Water extends Item {
  static icon = "&#x1F4A7;";
  static className = "Water";
  static adjectives = [Entity.adjectiveList.wet];

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(...Water.adjectives);
    this.icon = Water.icon;

    this.status.motives.amount = this.maxMotive * 2.5;

    this.setIcon();
  }
}

class Food extends Item {
  static icon = "&#x1F969;";
  static className = "Food";
  static adjectives = [Entity.adjectiveList.tasty];

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(...Food.adjectives);
    this.icon = Food.icon;

    this.status.motives.amount = this.maxMotive * 1.5;

    this.setIcon();
  }
}

class Bed extends Item {
  static icon = "&#x1F6CF;";
  static className = "Bed";
  static adjectives = [Entity.adjectiveList.restful];

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(...Bed.adjectives);
    this.icon = Bed.icon;

    this.setIcon();
  }
}

class Bone extends Item {
  static icon = "&#x1F9B4;";
  static className = "Bone";
  static adjectives = [Entity.adjectiveList.chew];

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(...Bone.adjectives);
    this.icon = Bone.icon;

    this.setIcon();
  }
}

class Ball extends Item {
  static icon = "&#x1F3BE;";
  static className = "Ball";
  static adjectives = [Entity.adjectiveList.chew, Entity.adjectiveList.bounce];

  constructor(world, params = {}) {
    super(world, params);
    this.adjectives.push(...Ball.adjectives);
    this.icon = Ball.icon;

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
    sitAround: "goalSitAround",
    knockItemFromToybox: "goalKnockItemFromToybox",
    chewToy: "goalChewToy",
    bounceToy: "goalBounceToy",
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
    sitAround: "planSitAround",
    moveToToybox: "planMoveToToybox",
    pushItemFromToybox: "planPushItemFromToybox",
    chewToy: "planChewToy",
    bounceToy: "planBounceToy",
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
    sitAround: "stateSitAround",
    moveToToybox: "stateMoveToToybox",
    pushItemFromToybox: "statePushItemFromToybox",
    chewToy: "stateChewToy",
    bounceToy: "stateBounceToy",
  };

  static motiveIcons = {
    thirst: "&#x1F4A7;",
    hunger: "&#x1F374;",
    tired: "&#x1F634;",
    drink: "&#x1F445;",
    eat: "&#x1F37D;",
    sleep: "&#x1F4A4;",
    petHappy: "&#x1FA77;",
    petAnnoyed: "&#x1F620;",
    movingToTarget: "&#x1F43E;",
    sitAround: "&#x2601;",
    pushItemFromToybox: "&#x1F4A5;",
    chewToy: "&#x1F9B7;",
    bounceToy: "&#x26F9;",
  };

  static personalityValues = [
    "liveliness",
    "patience",
    "naughtiness",
    "metabolism",
    "playfulness",
  ];
  
  static adjectives = [Entity.adjectiveList.animate];

  constructor(world, params = {}) {
    super(world, params);
    this.order = 2;
    this.adjectives.push(...Creature.adjectives);

    ["fullness", "hydration", "energy"].forEach((motive) => {
      this.status.motives[motive] = utilities.rand(this.maxMotive);
    });

    this.personality = {
      values: {},
    };

    let maxPersonalityValue = this.maxMotive;
    Creature.personalityValues.forEach((value) => {
      this.personality.values[value] = utilities.rand(maxPersonalityValue);
    });
    let personalityValues = this.getPersonalityValues();

    this.personality.decayThresholds = {
      fullness: personalityValues.metabolism / this.maxMotive,
      hydration: 0.4 + personalityValues.liveliness / (this.maxMotive * 3),
      energy:
        1 -
        (1 - personalityValues.metabolism / this.maxMotive) *
          (1 + personalityValues.liveliness / this.maxMotive),
      sitAround: personalityValues.liveliness / this.maxMotive,
      wander: 1 - personalityValues.liveliness / this.maxMotive,
    };
    for (let threshold in this.personality.decayThresholds) {
      this.personality.decayThresholds[threshold] = Math.max(
        0,
        Math.min(1, this.personality.decayThresholds[threshold])
      );
    }

    this.personality.desireThresholds = {
      sleep: this.maxMotive * 0.2 - personalityValues.liveliness / 10,
      eat: this.maxMotive * 0.4 + personalityValues.metabolism / 10,
      drink: this.maxMotive * 0.4 + personalityValues.liveliness / 10,
    };

    this.states = states;
    this.plans = plans;
    this.goals = goals;
    this.queries = queries;

    this.outputs.motives = {};

    this.icon = "&#x1F415;";
    this.setIcon();

    this.eventHandlers.petStart = () => {
      this.goalManager.addGoal(this, Creature.goalList.pet, {
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
      this.goalManager.deleteGoal(Creature.goalList.pet);
    };
    this.outputs.icon.addEventListener("mouseup", this.eventHandlers.petStop);

    this.goalManager = new GoalManager();
  }

  update() {
    this.metabolismManager();
    this.goalManager.update(this);
  }

  metabolismManager() {
    const personalityValues = this.getPersonalityValues();
    const decayThresholds = this.getDecayThresholds();

    // fullness decay
    if (this.status.state !== Creature.stateList.eat) {
      if (
        (this.status.state !== Creature.stateList.sleep ||
          Math.random() < 0.25) &&
        this.status.motives.fullness > 0
      ) {
        if (Math.random() < decayThresholds.fullness) {
          this.setMotive("fullness", this.status.motives.fullness - 1);
        }
      }
    }
    if (
      !(Creature.goalList.eat in this.goalManager.getGoalList()) &&
      this.queries.amIHungry(this)
    ) {
      this.goalManager.addGoal(this, Creature.goalList.eat, {}, false);
    }

    // hydration decay
    if (this.status.state !== Creature.stateList.drink) {
      if (
        (this.status.state !== Creature.stateList.sleep ||
          Math.random() < 0.25) &&
        this.status.motives.hydration > 0 &&
        Math.random() < decayThresholds.hydration
      ) {
        this.status.motives.hydration--;
      }
    }
    if (
      !(Creature.goalList.drink in this.goalManager.getGoalList()) &&
      this.queries.amIThirsty(this)
    ) {
      this.goalManager.addGoal(this, Creature.goalList.drink, {}, false);
    }

    // energy decay
    if (
      this.status.state !== Creature.stateList.sleep &&
      this.status.motives.energy > 0
    ) {
      if (Math.random() < decayThresholds.energy) {
        this.setMotive("energy", this.status.motives.energy - 1);
      }
    }
    if (
      !(Creature.goalList.sleep in this.goalManager.getGoalList()) &&
      this.queries.amITired(this)
    ) {
      this.goalManager.addGoal(this, Creature.goalList.sleep, {}, false);
    }
  }

  showMotive(motive) {
    if (!motive) {
      this.outputs.bubble.style.display = "none";
      return;
    }
    this.outputs.bubble.innerHTML = `<span>${motive}</span>`;
    this.outputs.bubble.style.display = "block";
  }

  getOutputs() {
    return this.outputs;
  }

  getGoals() {
    return this.goalManager.getGoalList();
  }

  getCurrentGoal() {
    return this.goalManager.getCurrentGoal();
  }

  getPersonalityValues() {
    return this.personality.values;
  }

  getPersonalityValue(value) {
    if (!(value in this.personality.values)) {
      console.error(`Error: no ${value} personality value found`);
      return;
    }
    return this.personality.values[value];
  }

  getDecayThresholds() {
    return this.personality.decayThresholds;
  }

  getDecayThreshold(value) {
    if (!(value in this.personality.decayThresholds)) {
      console.error(`Error: no ${value} decay threshold found`);
      return;
    }
    return this.personality.decayThresholds[value];
  }

  getDesireThresholds() {
    return this.personality.desireThresholds;
  }

  getDesireThreshold(desire) {
    if (!(desire in this.personality.desireThresholds)) {
      console.error(`Error: no ${desire} threshold value found`);
      return;
    }
    return this.personality.desireThresholds[desire];
  }

  setState(state) {
    this.status.state = state;
  }

  setPlan(plan) {
    this.status.plan = plan;
  }

  getPlan() {
    return this.status.plan;
  }

  setOutputEl(type, el) {
    this.outputs[type] = el;
  }

  setOutput(type, val, setVal = false) {
    if (type === "goals") {
      let table = document.createElement("table");
      let tr = document.createElement("tr");
      ["name", "priority", "suspended", "ticks", "target", "calledBy"].forEach(
        (item) => {
          let th = document.createElement("th");
          th.innerHTML = item;
          tr.appendChild(th);
          table.appendChild(tr);
        }
      );
      for (let goal in val) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = goal;
        tr.appendChild(td);
        ["priority", "suspended", "ticks", "target", "calledBy"].forEach(
          (item) => {
            let td = document.createElement("td");
            td.innerHTML = val[goal][item];
            tr.appendChild(td);
          }
        );
        table.appendChild(tr);
      }
      this.outputs[type].innerHTML = "";
      this.outputs[type].appendChild(table);
    } else {
      if (setVal) {
        this.outputs[type].value = val;
      } else {
        this.outputs[type].innerHTML = JSON.stringify(val);
      }
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
