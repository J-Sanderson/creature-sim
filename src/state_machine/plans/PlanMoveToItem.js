import { stateList } from '../../defaults';

export const planMoveToItem = function (self, id, goal) {
  const item = self.queries.getItemFromWorld(self, id);
  if (!item) {
    self.goalManager.deleteGoal(goal);
    return;
  }
  const itemPos = item.getPosition();
  self.setState(stateList.moveToPosition);
  self.status.state.execute(self, itemPos);
};
