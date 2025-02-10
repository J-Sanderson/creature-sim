import State from './State';
import { stateList, emotionList, motiveIconList } from '../../defaults';

export default class StateCuddleToy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.cuddleToy;
    this.suppressEmotionDecay.push(emotionList.happy);
  }

  execute(self, happiness) {
    self.showMotive(motiveIconList.cuddleToy);
    const maxMotive = self.getMaxMotive();
    if (happiness < maxMotive) {
      self.emotionManager.setEmotion(self, emotionList.happy, happiness + 1);
    }
  }
}
