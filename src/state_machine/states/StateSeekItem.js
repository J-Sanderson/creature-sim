import State from './State';
import worldManager from '../../managers/WorldManager';
import { stateList, emotionList } from '../../defaults';

export default class StateSeekItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.seekItem;
    this.suppressEmotionDecay.push(emotionList.sad);
  }

  execute(self, motive, pos) {
    const emotions = self.getEmotions();
    self.emotionManager.setEmotion(self, emotionList.happy, emotions[emotionList.happy] - 1);
    self.emotionManager.setEmotion(self, emotionList.sad, emotions[emotionList.sad] + 1);

    if (motive) {
      self.showMotive(motive);
    }

    self.setXPosition(pos.x);
    self.setYPosition(pos.y);
    const world = worldManager.getWorld(self.world);
    world.moveEntity(self.outputs.icon, self.getPosition());
  }
}
