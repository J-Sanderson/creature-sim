import Goal from './Goal';
import {
  adjectiveList,
  motiveList,
  personalityValueList,
  goalList,
} from '../../defaults';

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
          modifiers.personality[personalityValueList.liveliness],
          modifiers.maxMotive,
          ticks,
          false
        );
        this.setTicks(adjustedTicks);

        let threshold = this.getDecayThreshold();
        const adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.liveliness],
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

    for (let motive in motives) {
      if (motives[motive] <= maxMotive / 10) {
        return -1;
      }
    }

    const goals = self.getGoals();
    if (
      goals.hasOwnProperty(goalList.eat) ||
      goals.hasOwnProperty(goalList.drink) ||
      goals.hasOwnProperty(goalList.sleep)
    ) {
      return -1;
    }

    let priority = 7;

    if (motives[motiveList.energy] <= maxMotive / 3) {
      priority += 1;
    }

    const livelinessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.liveliness,
      false
    );
    priority -= livelinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    // am I on an item?
    let item = self.queries.getItemIAmOn(self);
    if (item && !item.getAdjectives().includes(adjectiveList.restful)) {
      self.plans.planMoveFromItem(self);
      return;
    }

    this.decrementTicks();
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(goalList.sitAround);
    }
    self.plans.planSitAround(self);
  }
}
