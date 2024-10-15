import Goal from './Goal';
import {
  adjectiveList,
  personalityValueList,
  goalList,
  goalTypeList,
} from '../../defaults';

export default class GoalBounceToy extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;

    if (params && params.hasOwnProperty('tickModifiers')) {
      const modifiers = params.tickModifiers;
      if (
        modifiers.hasOwnProperty('maxMotive') &&
        modifiers.hasOwnProperty('personality')
      ) {
        let ticks = this.getTicks();
        let adjustedTicks = this.calculateModifiedTicks(
          modifiers.personality[personalityValueList.liveliness],
          modifiers.maxMotive,
          ticks,
          true
        );
        adjustedTicks = this.calculateModifiedTicks(
          modifiers.personality[personalityValueList.playfulness],
          modifiers.maxMotive,
          adjustedTicks,
          true
        );
        this.setTicks(adjustedTicks);

        let threshold = this.getDecayThreshold();
        let adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.liveliness],
          modifiers.maxMotive,
          threshold,
          true
        );

        adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.playfulness],
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
      currentGoal !== goalList.knockItemFromToybox &&
      currentGoal !== goalList.bounceToy
    ) {
      return -1;
    }

    const motives = self.getMotives();
    const maxMotive = self.getMaxMotive();
    const motiveModifier = 0.1;

    for (let motive in motives) {
      if (motives[motive] <= maxMotive * motiveModifier) {
        return -1;
      }
    }

    const personalityValues = self.getPersonalityValues();
    const nearbyToys = self.queries.getItemsByAdjective(
      self,
      adjectiveList.bounce
    );


    if (
      !nearbyToys.length &&
      personalityValues[personalityValueList.naughtiness] < maxMotive - (maxMotive * motiveModifier) &&
      personalityValues[personalityValueList.independence] < maxMotive - (maxMotive * motiveModifier) &&
      personalityValues[personalityValueList.patience] > maxMotive * motiveModifier
    ) {
      return -1;
    }

    let priority = 7;

    const playfulnessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.playfulness,
      true
    );
    priority -= playfulnessModifier;

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
    let target = this.target;
    if (!target) {
      self.plans.planSeekItem(
        self,
        adjectiveList.bounce,
        null,
        goalList.bounceToy
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.bounceToy);
        }
        self.plans.planBounceToy(self);
      } else {
        self.plans.planMoveToItem(self, target, goalList.bounceToy);
      }
    }
  }
}
