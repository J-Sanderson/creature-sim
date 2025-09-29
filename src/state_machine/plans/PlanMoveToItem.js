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
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      self.goalManager.deleteGoal(goal.getName());
      return;
    }
    const itemPos = item.getPosition();
    goal.setDirection(itemPos.x, itemPos.y);

    self.setState(stateList.moveToPosition);
    self.getState().execute(self);
  }
}
