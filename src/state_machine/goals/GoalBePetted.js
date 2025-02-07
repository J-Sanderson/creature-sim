import Goal from './Goal';
import {
  goalList,
  stateList,
  goalTypeList,
  planList,
  personalityValueList,
} from '../../defaults';

export default class GoalBePetted extends Goal {
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
          modifiers.personality[personalityValueList.kindness],
          modifiers.maxMotive,
          ticks,
          true
        );
        adjustedTicks = this.calculateModifiedTicks(
          modifiers.personality[personalityValueList.independence],
          modifiers.maxMotive,
          ticks,
          false
        );
        this.setTicks(adjustedTicks);

        let threshold = this.getDecayThreshold();
        let adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.kindness],
          modifiers.maxMotive,
          threshold,
          true
        );
        adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.patience],
          modifiers.maxMotive,
          threshold,
          true
        );
        adjustedThreshold = this.calculateModifiedDecayThreshold(
          modifiers.personality[personalityValueList.independence],
          modifiers.maxMotive,
          threshold,
          false
        );
        this.setDecayThreshold(adjustedThreshold);
      }
    }
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    return 1;
  }
  execute(self) {
    const maxMotive = self.getMaxMotive();
    const motiveModifier = 0.1;
    const personalityValues = self.getPersonalityValues();

    const state = self.getState();
    if (
      state && 
      (state.name === stateList.drink ||
      state.name === stateList.eat ||
      state.name === stateList.sleep ||
      state.name === stateList.petAnnoyed)
    ) {
      const kindness = personalityValues[personalityValueList.kindness];
      const patience = personalityValues[personalityValueList.patience];
      if (
        kindness >= maxMotive - maxMotive * motiveModifier ||
        patience >= maxMotive - maxMotive * motiveModifier
      ) {
        self.setPlan(planList.petHappy);
      } else {
        self.setPlan(planList.petAnnoyed);
      }
      self.getPlan().execute(self);
      self.goalManager.deleteGoal(goalList.pet);
    } else {
      self.setPlan(planList.petHappy);
      self.getPlan().execute(self);
      if (
        self.queries.amIHungry(self) ||
        self.queries.amIThirsty(self) ||
        self.queries.amITired(self)
      ) {
        self.goalManager.deleteGoal(goalList.pet);
      } else {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.pet);
        }
      }
    }
  }
}
