import Goal from './Goal';
import {
  adjectiveList,
  personalityValueList,
  goalList,
  goalTypeList,
  planList,
} from '../../defaults';

export default class GoalBounceToy extends Goal {
  constructor(params) {
    super(params);
    this.name = goalList.bounceToy;
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
    const currentGoalName = self.getCurrentGoalName();
    if (
      this.getIsSuspended() &&
      currentGoalName !== goalList.knockItemFromToybox &&
      currentGoalName !== goalList.bounceToy
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
      personalityValues[personalityValueList.naughtiness] <
        maxMotive - maxMotive * motiveModifier &&
      personalityValues[personalityValueList.independence] <
        maxMotive - maxMotive * motiveModifier &&
      personalityValues[personalityValueList.patience] >
        maxMotive * motiveModifier
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
    let target = this.getTarget();
    if (!target) {
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(goalList.bounceToy);
      }
      self.setPlan(planList.seekItem);
      self.getPlan().execute(self, adjectiveList.bounce, goalList.bounceToy);
    } else {
      if (self.queries.amIOnItem(self, target)) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.bounceToy);
        }
        self.setPlan(planList.bounceToy);
        self.getPlan().execute(self);
      } else {
        self.setPlan(planList.moveToItem);
        self.getPlan().execute(self);
      }
    }
  }
}
