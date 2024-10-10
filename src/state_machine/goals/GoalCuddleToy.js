import Goal from './Goal';
import Creature from '../../entities/Creature';
import { adjectiveList, motiveList } from '../../defaults';

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
        adjectiveList.soft,
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
