import Goal from './Goal';
import { goalList, stateList, goalTypeList } from '../../defaults';

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
      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(goalList.pet);
      }
      self.plans.planPetAnnoyed(self);
    } else {
      if (
        self.queries.amIHungry(self) ||
        self.queries.amIThirsty(self) ||
        self.queries.amITired(self)
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
