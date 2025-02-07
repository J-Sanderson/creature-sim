import Goal from './Goal';
import { goalTypeList, goalList, planList } from '../../defaults';

export default class GoalSnubItem extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    return 1;
  }
  execute(self) {
    const target = this.getTarget();
    if (self.queries.amIOnItem(self, target)) {
      self.setPlan(planList.snubItem);
      self.status.plan.execute(self);

      this.decrementTicks();
      if (this.getTicks() <= 0) {
        self.goalManager.deleteGoal(goalList.snubItem);
      }
    } else {
      self.setPlan(planList.moveToItem);
      self.status.plan.execute(self, target, goalList.snubItem);
    }
  }
}
