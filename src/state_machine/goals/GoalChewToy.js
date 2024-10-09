import Goal from './Goal';
import Entity from '../../entities/Entity';
import Creature from '../../entities/Creature';

export default class GoalChewToy extends Goal {
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
