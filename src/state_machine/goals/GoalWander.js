import Goal from './Goal';
import { personalityValueList, goalList, planList } from '../../defaults';

export default class GoalWander extends Goal {
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
          true
        );
        this.setTicks(adjustedTicks);

        let threshold = this.getDecayThreshold();
        const adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.liveliness],
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
    const motiveModifier = 0.1;
    const maxMotive = self.getMaxMotive();

    for (let motive in motives) {
      if (motives[motive] <= maxMotive * motiveModifier) {
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

    const livelinessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.liveliness,
      true
    );
    priority -= livelinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    this.decrementTicks();
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(goalList.wander);
    }

    self.setPlan(planList.wander);
    self.getPlan().execute(self);
  }
}
