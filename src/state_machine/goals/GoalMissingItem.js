import Goal from './Goal';
import { personalityValueList, goalList, goalTypeList } from '../../defaults';

export default class GoalMissingItem extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;
  }
  filter(self, nonReactive = false) {
    if (nonReactive) return -1;

    const target = this.getTarget();
    if (!target) return -1;

    const maxMotive = self.getMaxMotive();
    const personalityValues = self.getPersonalityValues();
    const patience = personalityValues[personalityValueList.patience];
    if (patience >= maxMotive - (maxMotive / 10)) return -1;

    return 1;
  }
  execute(self) {
    const goals = self.getGoals();
    const target = this.getTarget();
    const targetingGoal = Object.keys(goals).find(goal => {
        return goal !== goalList.missingItem && goals[goal].getTarget() === target;
    });
    if (!targetingGoal) {
        self.goalManager.deleteGoal(goalList.missingItem);
        return;
    }

    self.goalManager.suspendGoal(targetingGoal);
    self.plans.planMissingItem(self);
    this.decrementTicks();
    if (this.getTicks() <= 0) {
      self.goalManager.deleteGoal(goalList.missingItem);
      self.goalManager.unsuspendGoal(targetingGoal);
    }
  }
}
