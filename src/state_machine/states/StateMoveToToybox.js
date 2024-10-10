import worldManager from '../../managers/WorldManager';
import { stateList, motiveIconList } from '../../defaults';

export const stateMoveToToybox = function (self) {
  self.setState(stateList.moveToToybox);
  self.showMotive(motiveIconList.movingToTarget);
  const pos = self.getPosition();
  self.setYPosition(pos.y + 1);
  const world = worldManager.getWorld(self.world);
  world.moveEntity(self.outputs.icon, self.getPosition());
};
