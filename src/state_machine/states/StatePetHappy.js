import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StatePetHappy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.petHappy;
    this.suppressEmotionDecay.push(emotionList.happy);
  }

  execute(self, happiness) {
    self.showMotive(motiveIconList.petHappy);
    const maxMotive = self.getMaxMotive();
    if (happiness < maxMotive) {
      self.setEmotion(emotionList.happy, happiness + 1);
    }
  }
}
