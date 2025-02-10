import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StateSnubItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.snubItem;
  }

  execute(self, anger) {
    self.showMotive(motiveIconList.snubItem);
    const maxMotive = self.getMaxMotive();
    if (anger < maxMotive) {
      self.emotionManager.setEmotion(self, emotionList.angry, anger + 5);
    }
  }
}
