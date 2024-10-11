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
    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();

    if (
      self.status.state === stateList.drink ||
      self.status.state === stateList.eat ||
      self.status.state === stateList.sleep ||
      self.status.state === stateList.petAnnoyed
    ) {
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(goalList.pet);
      }
      const kindness = personalityValues[personalityValueList.kindness];
      const patience = personalityValues[personalityValueList.patience];
      if (kindness >= maxMotive - maxMotive / 10 || patience >= maxMotive - maxMotive / 10) {
        self.plans.planPetHappy(self);
      } else {
        self.plans.planPetAnnoyed(self);
      }
    } else {
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
