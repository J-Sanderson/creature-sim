import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StateMissingItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.missingItem;
  }

  execute(self, emotion) {
    self.showMotive(motiveIconList.missingItem);
    const emotions = self.getEmotions();
    self.emotionManager.setEmotion(self, emotion, emotions[emotion] + 5);
  }
}
