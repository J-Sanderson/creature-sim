import Entity from "../../entities/Entity";
import Creature from "../../entities/Creature";

class Goal {
    static types = {
      motive: "motive",
      idle: "idle",
      narrative: "narrative",
    };
  
    static defaults = {
      priority: 1,
      suspended: false,
      ticks: -1,
      decayThreshold: 1,
      target: null,
      calledBy: null,
      type: Goal.types.idle,
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
      const threshold = this.decayThreshold;
      if (this.ticks > 0 && (threshold === 1 || Math.random() <= threshold)) {
        this.ticks--;
      }
    }
  
    getTicks() {
      return this.ticks;
    }
  
    setTicks(val) {
      this.ticks = val;
    }
  
    getDecayThreshold() {
      return this.decayThreshold;
    }
  
    setDecayThreshold(val) {
      this.decayThreshold = val;
    }
  
    setTarget(target) {
      this.target = target;
    }
  
    getCalledBy() {
      return this.calledBy;
    }
  
    calculatePersonalityModifier(self, personalityType, positive = true) {
      const personalityValues = self.getPersonalityValues();
      const personalityValue = personalityValues[personalityType];
      if (!personalityValue) {
        console.error(`Error: no personality value found for ${personalityType}`);
        return 0;
      }
      const maxMotive = self.getMaxMotive();
      const scaler = 3;
  
      let factor = Math.min(1, personalityValue / maxMotive);
      if (!positive) {
        factor = 1 - factor;
      }
  
      const modifier = Math.floor(scaler * factor);
      return modifier;
    }
  
    calculateModifiedTicks(personalityVal, maxMotive, ticks, positive = true) {
      if (!personalityVal || !maxMotive) {
        console.error(
          `Error: could not find personality value or max motive value`
        );
        return 0;
      }
      const scaler = 0.5;
      const baseline = 1;
  
      let factor = Math.min(1, personalityVal / maxMotive);
      if (!positive) {
        factor = 1 - factor;
      }
  
      const adjustedTicks = Math.floor(ticks * (baseline + scaler * factor));
      return adjustedTicks;
    }
  
    calculateModifiedDecayThreshold(personalityVal, maxMotive, threshold, positive = true) {
      const max = 1;
      const min = 0.4;
      if (!personalityVal || !maxMotive) {
        console.error(
          `Error: could not find personality value or max motive value`
        );
        return max;
      }
  
      let factor = personalityVal / maxMotive;
      if (!positive) {
        factor = 1 - factor;
      }
      
      factor = threshold - factor;
  
      factor = Math.min(max, factor);
      factor = Math.max(min, factor);
  
      return factor;
    }
  }
  
  class GoalWander extends Goal {
    constructor(params) {
      super(params);
  
      if (params && params.hasOwnProperty("tickModifiers")) {
        const modifiers = params.tickModifiers;
        if (
          modifiers.hasOwnProperty("maxMotive") &&
          modifiers.hasOwnProperty("personality")
        ) {
          let ticks = this.getTicks();
          const adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            ticks,
            true
          );
          this.setTicks(adjustedTicks);
  
          let threshold = this.getDecayThreshold();
          const adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            threshold,
            true
          );
          this.setDecayThreshold(adjustedThreshold);
        }
      }
    }
    filter(self, nonReactive = false) {
      const motives = self.getMotives();
      const maxMotive = self.getMaxMotive();
  
      for (let motive in motives) {
        if (motives[motive] <= maxMotive / 10) {
          return -1;
        }
      }
  
      const goals = self.getGoals();
      if (
        goals.hasOwnProperty(Creature.goalList.eat) ||
        goals.hasOwnProperty(Creature.goalList.drink) ||
        goals.hasOwnProperty(Creature.goalList.sleep)
      ) {
        return -1;
      }
  
      let priority = 7;
  
      const livelinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.liveliness,
        true
      );
      priority -= livelinessModifier;
  
      priority = Math.max(1, priority);
  
      return priority;
    }
    execute(self) {
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(Creature.goalList.wander);
      }
  
      self.plans.planWander(self);
    }
  }
  
  class GoalEat extends Goal {
    constructor(params) {
      super(params);
      this.type = Goal.types.motive;
    }
    filter(self, nonReactive = false) {
      if (nonReactive) return -1;
  
      const motives = self.getMotives();
      const maxMotive = self.getMaxMotive();
      const personalityValues = self.getPersonalityValues();
      const plan = self.getPlan();
      const nearbyFood = self.queries.getItemsByAdjective(
        self,
        Entity.adjectiveList.tasty
      );
  
      let priority = 6;
  
      if (
        plan === Creature.planList.eat ||
        motives[Entity.motiveList.fullness] <= maxMotive / 10
      ) {
        priority = 1;
      }
  
      if (nearbyFood.length) {
        if (motives[Entity.motiveList.fullness] <= maxMotive / 2) {
          priority = 4;
        } else if (motives[Entity.motiveList.fullness] <= maxMotive / 1.53) {
          priority = 5;
        }
        const pref = self.getFavorites().flavor;
        const preferredFood = nearbyFood.filter((item) => {
          return item.getFlavors().includes(pref);
        });
        if (preferredFood.length) {
          priority += 2;
        }
      }
  
      const metabolismModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.metabolism,
        true
      );
      priority -= metabolismModifier;
  
      priority = Math.max(1, priority);
  
      return priority;
    }
    execute(self) {
      if (self.getMotive(Entity.motiveList.fullness) >= self.getMaxMotive()) {
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
      this.type = Goal.types.motive;
    }
    filter(self, nonReactive = false) {
      if (nonReactive) return -1;
  
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
        motives[Entity.motiveList.hydration] <= maxMotive / 10
      ) {
        priority = 1;
      }
  
      if (nearbyWater.length) {
        if (motives[Entity.motiveList.hydration] <= maxMotive / 2) {
          priority = 4;
        } else if (motives[Entity.motiveList.hydration] <= maxMotive / 1.53) {
          priority = 5;
        }
      }
  
      const livelinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.liveliness,
        true
      );
      priority -= livelinessModifier;
  
      priority = Math.max(1, priority);
  
      return priority;
    }
    execute(self) {
      if (self.getMotive(Entity.motiveList.hydration) >= self.getMaxMotive()) {
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
      this.type = Goal.types.motive;
    }
    filter(self, nonReactive = false) {
      if (nonReactive) return -1;
  
      const motives = self.getMotives();
      const maxMotive = self.getMaxMotive();
      const personalityValues = self.getPersonalityValues();
      const plan = self.getPlan();
      const nearbyBeds = self.queries.getItemsByAdjective(
        self,
        Entity.adjectiveList.restful
      );
  
      let priority = 6;
  
      if (
        plan === Creature.planList.sleep ||
        motives[Entity.motiveList.energy] <= maxMotive / 10
      ) {
        priority = 1;
      }
  
      if (nearbyBeds.length) {
        if (motives[Entity.motiveList.energy] <= maxMotive / 2) {
          priority = 4;
        } else if (motives[Entity.motiveList.energy] <= maxMotive / 1.53) {
          priority = 5;
        }
      }
  
      const livelinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.liveliness,
        false
      );
      priority -= livelinessModifier;
  
      priority = Math.max(1, priority);
  
      return priority;
    }
    execute(self) {
      if (self.getMotive(Entity.motiveList.energy) >= self.getMaxMotive()) {
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
      this.type = Goal.types.narrative;
    }
    filter(self, nonReactive = false) {
      if (nonReactive) return -1;
  
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
  
      if (params && params.hasOwnProperty("tickModifiers")) {
        const modifiers = params.tickModifiers;
        if (
          modifiers.hasOwnProperty("maxMotive") &&
          modifiers.hasOwnProperty("personality")
        ) {
          let ticks = this.getTicks();
          const adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            ticks,
            false
          );
          this.setTicks(adjustedTicks);
          
          let threshold = this.getDecayThreshold();
          const adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            threshold,
            false
          );
          this.setDecayThreshold(adjustedThreshold);
        }
      }
    }
    filter(self, nonReactive = false) {
      const motives = self.getMotives();
      const maxMotive = self.getMaxMotive();
      const personalityValues = self.getPersonalityValues();
  
      for (let motive in motives) {
        if (motives[motive] <= maxMotive / 10) {
          return -1;
        }
      }
  
      const goals = self.getGoals();
      if (
        goals.hasOwnProperty(Creature.goalList.eat) ||
        goals.hasOwnProperty(Creature.goalList.drink) ||
        goals.hasOwnProperty(Creature.goalList.sleep)
      ) {
        return -1;
      }
  
      let priority = 7;
  
      if (motives[Entity.motiveList.energy] <= maxMotive / 3) {
        priority += 1;
      }
  
      const livelinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.liveliness,
        false
      );
      priority -= livelinessModifier;
  
      priority = Math.max(1, priority);
  
      return priority;
    }
    execute(self) {
      // am I on an item?
      let item = self.queries.getItemIAmOn(self);
      if (item && !item.getAdjectives().includes(Entity.adjectiveList.restful)) {
        self.plans.planMoveFromItem(self);
        return;
      }
  
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(Creature.goalList.sitAround);
      }
      self.plans.planSitAround(self);
    }
  }
  
  class GoalKnockItemFromToybox extends Goal {
    constructor(params) {
      super(params);
      this.type = Goal.types.narrative;
    }
    filter(self, nonReactive = false) {
      const personalityValues = self.getPersonalityValues();
      const maxMotive = self.getMaxMotive();
  
      if (
        personalityValues.naughtiness <= maxMotive * 0.1 &&
        personalityValues.patience >= maxMotive * 0.1
      ) {
        return -1;
      }
  
      const goals = self.getGoals();
      const calledBy =
        goals[Creature.goalList.knockItemFromToybox]?.getCalledBy();
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
          case Creature.goalList.cuddleToy:
            adj = Entity.adjectiveList.soft;
            break;
        }
        if (adj && self.queries.getItemsByAdjective(self, adj).length) {
          return -1;
        }
      } else {
        let toybox = document.querySelector(`[data-world="${self.world}"]`);
        let buttons = Array.from(toybox.querySelectorAll("button"));
        if (buttons.every((button) => button.classList.contains("item-active"))) {
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
  
      const patienceModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.patience,
        false
      );
      priority -= patienceModifier;
  
      const kindnessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.kindness,
        false
      );
      priority -= kindnessModifier;
  
      const naughtinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.naughtiness,
        true
      );
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
      this.type = Goal.types.narrative;
  
      if (params && params.hasOwnProperty("tickModifiers")) {
        const modifiers = params.tickModifiers;
        if (
          modifiers.hasOwnProperty("maxMotive") &&
          modifiers.hasOwnProperty("personality")
        ) {
          let ticks = this.getTicks();
          let adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.naughtiness],
            modifiers.maxMotive,
            ticks,
            true
          );
          adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.playfulness],
            modifiers.maxMotive,
            adjustedTicks,
            true
          );
          this.setTicks(adjustedTicks);
          
          let threshold = this.getDecayThreshold();
          let adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.naughtiness],
            modifiers.maxMotive,
            threshold,
            true
          );
          
          adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.kindness],
            modifiers.maxMotive,
            threshold,
            false
          );
  
          this.setDecayThreshold(adjustedThreshold);
        }
      }
    }
    filter(self, nonReactive = false) {
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
  
      const playfulnessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.playfulness,
        true
      );
      priority -= playfulnessModifier;
  
      const livelinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.liveliness,
        false
      );
      priority -= livelinessModifier;
  
      const kindnessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.kindness,
        false
      );
      priority -= kindnessModifier;
  
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
      this.type = Goal.types.narrative;
  
      if (params && params.hasOwnProperty("tickModifiers")) {
        const modifiers = params.tickModifiers;
        if (
          modifiers.hasOwnProperty("maxMotive") &&
          modifiers.hasOwnProperty("personality")
        ) {
          let ticks = this.getTicks();
          let adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            ticks,
            true
          );
          adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.playfulness],
            modifiers.maxMotive,
            adjustedTicks,
            true
          );
          this.setTicks(adjustedTicks);
          
          let threshold = this.getDecayThreshold();
          let adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            threshold,
            true
          );
          
          adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.playfulness],
            modifiers.maxMotive,
            threshold,
            true
          );
  
          this.setDecayThreshold(adjustedThreshold);
        }
      }
    }
    filter(self, nonReactive = false) {
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
  
      const playfulnessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.playfulness,
        true
      );
      priority -= playfulnessModifier;
  
      const livelinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.liveliness,
        true
      );
      priority -= livelinessModifier;
  
      priority = Math.max(1, priority);
  
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
  
  class GoalCuddleToy extends Goal {
    constructor(params) {
      super(params);
      this.type = Goal.types.narrative;
  
      if (params && params.hasOwnProperty("tickModifiers")) {
        const modifiers = params.tickModifiers;
        if (
          modifiers.hasOwnProperty("maxMotive") &&
          modifiers.hasOwnProperty("personality")
        ) {
          let ticks = this.getTicks();
          let adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            ticks,
            false
          );
          adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.playfulness],
            modifiers.maxMotive,
            adjustedTicks,
            true
          );
          adjustedTicks = this.calculateModifiedTicks(
            modifiers.personality[Creature.personalityValues.kindness],
            modifiers.maxMotive,
            adjustedTicks,
            true
          );
          this.setTicks(adjustedTicks);
          
          let threshold = this.getDecayThreshold();
          let adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.liveliness],
            modifiers.maxMotive,
            threshold,
            false
          );
          
          adjustedThreshold = this.calculateModifiedDecayThreshold(
            modifiers.personality[Creature.personalityValues.kindness],
            modifiers.maxMotive,
            threshold,
            true
          );
  
          this.setDecayThreshold(adjustedThreshold);
        }
      }
    }
    filter(self, nonReactive = false) {
      const currentGoal = self.getCurrentGoal();
      if (
        this.getIsSuspended() &&
        currentGoal !== Creature.goalList.knockItemFromToybox &&
        currentGoal !== Creature.goalList.cuddleToy
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
        Entity.adjectiveList.soft
      );
  
      if (
        !nearbyToys.length &&
        personalityValues.naughtiness < maxMotive * 0.9 &&
        personalityValues.patience > maxMotive * 0.1
      ) {
        return -1;
      }
  
      let priority = 7;
  
      const playfulnessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.playfulness,
        true
      );
      priority -= playfulnessModifier;
  
      const livelinessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.liveliness,
        false
      );
      priority -= livelinessModifier;
  
      const kindnessModifier = this.calculatePersonalityModifier(
        self,
        Creature.personalityValues.kindness,
        true
      );
      priority -= kindnessModifier;
  
      priority = Math.max(1, priority);
  
      return priority;
    }
    execute(self) {
      let target = this.target;
      if (!target) {
        self.plans.planSeekItem(
          self,
          Entity.adjectiveList.soft,
          null,
          Creature.goalList.cuddleToy
        );
      } else {
        if (self.queries.amIOnItem(self, target)) {
          this.decrementTicks();
          if (this.getTicks() <= 0) {
            self.goalManager.deleteGoal(Creature.goalList.cuddleToy);
          }
          self.plans.planCuddleToy(self);
        } else {
          self.plans.planMoveToItem(self, target, Creature.goalList.cuddleToy);
        }
      }
    }
  }
  
  export default {
    goalWander: GoalWander,
    goalEat: GoalEat,
    goalDrink: GoalDrink,
    goalSleep: GoalSleep,
    goalBePetted: GoalBePetted,
    goalSitAround: GoalSitAround,
    goalKnockItemFromToybox: GoalKnockItemFromToybox,
    goalChewToy: GoalChewToy,
    goalBounceToy: GoalBounceToy,
    goalCuddleToy: GoalCuddleToy,
  };