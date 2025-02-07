import Plan from './Plan';
import { stateList, planList } from '../../defaults';

export default class PlanMoveToItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.moveToItem;
  }

  execute(self, id, goal) {
    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      self.goalManager.deleteGoal(goal);
      return;
    }
    const itemPos = item.getPosition();
    self.setState(stateList.moveToPosition);
    self.status.state.execute(self, itemPos);
  }
}
