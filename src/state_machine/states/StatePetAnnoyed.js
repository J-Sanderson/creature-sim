import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StatePetAnnoyed extends State {
  constructor(params) {
    super(params);

    this.name = stateList.petAnnoyed;
    this.suppressEmotionDecay.push(emotionList.angry);
  }

  execute(self, anger) {
    self.showMotive(motiveIconList.petAnnoyed);
    const maxMotive = self.getMaxMotive();
    if (anger < maxMotive) {
      self.emotionManager.setEmotion(self, emotionList.angry, anger + 5);
    }
  }
}
