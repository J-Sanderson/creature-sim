import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanWander extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.wander;
  }

  execute(self) {
    const validDirections = self.queries.getValidDirections(self);

    if (validDirections.length > 0) {
      const randomDirection = Math.floor(
        Math.random() * validDirections.length
      );
      const { dx, dy } = validDirections[randomDirection];
      const position = self.getPosition();

      const newX = position.x + dx;
      const newY = position.y + dy;

      self.setState(stateList.wander);
      self.getState().execute(self, { x: newX, y: newY });
    } else {
      console.error('No valid movement direction available');
    }
  }
}
