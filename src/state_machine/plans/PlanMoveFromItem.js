import { planList } from '../../defaults';

export const planMoveFromItem = function (self) {
  self.setPlan(planList.moveFromItem);
  const validDirections = self.queries.getValidDirections(self);

  // todo should try to move to an empty square if possible
  if (validDirections.length > 0) {
    const randomDirection = Math.floor(Math.random() * validDirections.length);
    const { dx, dy } = validDirections[randomDirection];
    const position = self.getPosition();
    const newX = position.x + dx;
    const newY = position.y + dy;
    self.states.stateMoveToPosition(self, { x: newX, y: newY });
  } else {
    console.error('No valid movement direction available');
  }
};
