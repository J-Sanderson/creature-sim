import State from './State';
import { emotionList, motiveIconList, stateList } from '../../defaults';

export default class StateChewToy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.chewToy;
    this.suppressEmotionDecay.push(emotionList.happy);
  }

  execute(self, happiness) {
    self.showMotive(motiveIconList.chewToy);
    const maxMotive = self.getMaxMotive();
    if (happiness < maxMotive) {
      self.setEmotion(emotionList.happy, happiness + 1);
    }
  }
}
