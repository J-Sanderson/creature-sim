import Goal from './Goal';
import { goalTypeList, goalList, stateList } from '../../defaults';

export default class GoalAddedItem extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    if (
        self.queries.amIHungry(self) ||
        self.queries.amIThirsty(self) ||
        self.queries.amITired(self) ||
        self.status.state === stateList.drink ||
        self.status.state === stateList.eat ||
        self.status.state === stateList.sleep
      ) {
        return -1;
      }

    return 1;
  }
  execute(self) {
    // todo, depending on personality, preferences etc, investigate object, spawn new goals.
    self.plans.planAddedItem(self);
    this.decrementTicks();
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(goalList.addedItem);
    }
  }
}
