import worldManager from '../../managers/WorldManager';
import { stateList, motiveIconList } from '../../defaults';

export const stateMoveToPosition = function (self, newPos) {
  self.setState(stateList.moveToPosition);
  self.showMotive(motiveIconList.movingToTarget);

  // move toward the item
  const position = self.getPosition();
  if (newPos.x > position.x) {
    self.setXPosition(position.x + 1);
  }
  if (newPos.x < position.x) {
    self.setXPosition(position.x - 1);
  }
  if (newPos.y > position.y) {
    self.setYPosition(position.y + 1);
  }
  if (newPos.y < position.y) {
    self.setYPosition(position.y - 1);
  }
  const world = worldManager.getWorld(self.world);
  world.moveEntity(self.outputs.icon, self.getPosition());
};
