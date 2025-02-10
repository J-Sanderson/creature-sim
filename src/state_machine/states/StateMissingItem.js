import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StateMissingItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.missingItem;
  }

  execute(self, sadness) {
    self.showMotive(motiveIconList.missingItem);
    const maxMotive = self.getMaxMotive();
    if (sadness < maxMotive) {
      self.emotionManager.setEmotion(self, emotionList.sad, sadness + 1);
    }
  }
}
