import Goal from './Goal';
import {
  goalList,
  stateList,
  goalTypeList,
  personalityValueList,
} from '../../defaults';

export default class GoalBePetted extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    return 1;
  }
  execute(self) {
    if (
      self.status.state === stateList.drink ||
      self.status.state === stateList.eat ||
      self.status.state === stateList.sleep ||
      self.status.state === stateList.petAnnoyed
    ) {
      // todo don't get annoyed if very kind or patient, but still return to what it was doing
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(goalList.pet);
      }
      self.plans.planPetAnnoyed(self);
    } else {
      const maxMotive = self.getMaxMotive();
      const personalityValues = self.getPersonalityValues();
      const independence = personalityValues[personalityValueList.independence];
      const patience = personalityValues[personalityValueList.patience];
      if (
        self.queries.amIHungry(self) ||
        self.queries.amIThirsty(self) ||
        self.queries.amITired(self) ||
        independence >= maxMotive - maxMotive / 7 ||
        patience <= maxMotive / 7
      ) {
        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.pet);
        }
      }
      self.plans.planPetHappy(self);
    }
  }
}
