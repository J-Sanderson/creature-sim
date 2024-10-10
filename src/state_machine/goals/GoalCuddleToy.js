import Goal from './Goal';
import { adjectiveList, personalityValueList, goalList } from '../../defaults';

export default class GoalCuddleToy extends Goal {
  constructor(params) {
    super(params);
    this.type = Goal.types.narrative;

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
          false
        );
        adjustedTicks = this.calculateModifiedTicks(
          modifiers.personality[personalityValueList.playfulness],
          modifiers.maxMotive,
          adjustedTicks,
          true
        );
        adjustedTicks = this.calculateModifiedTicks(
          modifiers.personality[personalityValueList.kindness],
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
          false
        );

        adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.kindness],
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
      currentGoal !== goalList.cuddleToy
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
      adjectiveList.soft
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
        adjectiveList.soft,
        null,
        goalList.cuddleToy
      );
    } else {
      if (self.queries.amIOnItem(self, target)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.cuddleToy);
        }
        self.plans.planCuddleToy(self);
      } else {
        self.plans.planMoveToItem(self, target, goalList.cuddleToy);
      }
    }
  }
}
