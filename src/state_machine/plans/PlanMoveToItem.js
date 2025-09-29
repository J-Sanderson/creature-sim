import Plan from './Plan';
import { stateList, planList } from '../../defaults';

export default class PlanMoveToItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.moveToItem;
  }

  execute(self, id) {
    // todo: the item should be taken from the target object on the worldToken
    const goal = self.goalManager.getCurrentGoal();
    console.log(goal);
    const goalName = self.goalManager.getCurrentGoalName();
    if (!goalName) {
      console.error(`Error: no valid goal name found for ${this.name}`);
      return;
    }

    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      self.goalManager.deleteGoal(goalName);
      return;
    }
    const itemPos = item.getPosition();
    const goalObj = self.goalManager.getGoals()[goalName];
    if (goalObj) {
      goalObj.setDirection(itemPos.x, itemPos.y);
    }

    self.setState(stateList.moveToPosition);
    self.getState().execute(self);
  }
}
