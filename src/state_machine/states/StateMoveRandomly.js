import worldManager from '../../managers/WorldManager';
import { stateList } from '../../defaults';

export const stateMoveRandomly = function (self, pos) {
  self.setState(stateList.wander);
  self.showMotive('');
  self.setXPosition(pos.x);
  self.setYPosition(pos.y);

  const world = worldManager.getWorld(self.world);
  world.moveEntity(self.outputs.icon, self.getPosition());
};
