import Goal from './Goal';
import {
  adjectiveList,
  personalityValueList,
  goalList,
  goalTypeList,
} from '../../defaults';

export default class GoalChewToy extends Goal {
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
          modifiers.personality[personalityValueList.naughtiness],
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
          modifiers.personality[personalityValueList.naughtiness],
          modifiers.maxMotive,
          threshold,
          true
        );

        adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.kindness],
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
      currentGoal !== goalList.knockItemFromToybox &&
      currentGoal !== goalList.chewToy
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
      adjectiveList.chew
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
      personalityValueList.playfulness,
      true
    );
    priority -= playfulnessModifier;

    const livelinessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.liveliness,
      false
    );
    priority -= livelinessModifier;

    const kindnessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.kindness,
      false
    );
    priority -= kindnessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    let target = this.target;
    if (!target) {
      self.plans.planSeekItem(self, adjectiveList.chew, null, goalList.chewToy);
    } else {
      if (self.queries.amIOnItem(self, target)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.chewToy);
        }
        self.plans.planChewToy(self);
      } else {
        self.plans.planMoveToItem(self, target, goalList.chewToy);
      }
    }
  }
}
