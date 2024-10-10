export const planMoveToItem = function (self, id, goal) {
  const item = self.queries.getItemFromWorld(self, id);
  if (!item) {
    self.goalManager.deleteGoal(goal);
    return;
  }
  const itemPos = item.getPosition();
  self.states.stateMoveToPosition(self, itemPos);
};
