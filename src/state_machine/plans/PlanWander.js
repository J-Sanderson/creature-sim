import { planList } from '../../defaults';

export const planWander = function (self) {
  self.setPlan(planList.wander);
  const validDirections = self.queries.getValidDirections(self);

  if (validDirections.length > 0) {
    const randomDirection = Math.floor(Math.random() * validDirections.length);
    const { dx, dy } = validDirections[randomDirection];
    const position = self.getPosition();

    const newX = position.x + dx;
    const newY = position.y + dy;

    self.states.stateMoveRandomly(self, { x: newX, y: newY });
  } else {
    console.error('No valid movement direction available');
  }
};
