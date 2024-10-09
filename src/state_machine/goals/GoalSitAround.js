import Goal from './Goal';
import Entity from '../../entities/Entity';
import Creature from '../../entities/Creature';

export default class GoalSitAround extends Goal {
  constructor(params) {
    super(params);

    if (params && params.hasOwnProperty('tickModifiers')) {
      const modifiers = params.tickModifiers;
      if (
        modifiers.hasOwnProperty('maxMotive') &&
        modifiers.hasOwnProperty('personality')
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
