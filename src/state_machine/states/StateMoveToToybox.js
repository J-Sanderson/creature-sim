import State from './State';
import worldManager from '../../managers/WorldManager';
import { stateList, motiveIconList } from '../../defaults';

export default class StateMoveToToybox extends State {
  constructor(params) {
    super(params);
  }

  execute(self) {
    self.showMotive(motiveIconList.movingToTarget);
    const pos = self.getPosition();
    self.setYPosition(pos.y + 1);
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  }
}
