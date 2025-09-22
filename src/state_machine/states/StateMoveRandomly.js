import State from './State';
import worldManager from '../../managers/WorldManager';
import { stateList } from '../../defaults';

export default class StateMoveRandomly extends State {
  constructor(params) {
    super(params);

    this.name = stateList.wander;
  }

  execute(self) {
    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
    if (goal) {
      const pos = goal.getDirection();
      self.showMotive('');
      self.setXPosition(pos.x);
      self.setYPosition(pos.y);

      const world = worldManager.getWorld(self.world);
      world.moveEntity(self.outputs.icon, self.getPosition());
    }
  }
}
