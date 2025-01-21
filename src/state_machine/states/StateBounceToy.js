import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StateBounceToy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.bounceToy;
  }

  execute(self, happiness) {
    self.showMotive(motiveIconList.bounceToy);
    const maxMotive = self.getMaxMotive();
    if (happiness < maxMotive) {
      self.setEmotion(emotionList.happy, happiness + 1);
    }
  }
}
