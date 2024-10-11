import Goal from './Goal';
import { goalList, goalTypeList } from '../../defaults';

export default class GoalMissingItem extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    const target = this.getTarget();
    if (!target) return -1;

    const goals = self.getGoals();
    const currentGoal = self.getCurrentGoal();
    const currentTarget = goals[currentGoal]?.getTarget();

    if (!currentTarget || currentTarget !== target) {
      return -1;
    } else {
      // todo add some extra personality filtering here
      return 1;
    }
  }
  execute(self) {
    self.plans.planMissingItem(self);
    this.decrementTicks();
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(goalList.missingItem);
    }
  }
}
