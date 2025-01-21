import State from './State';
import { stateList, emotionList, motiveIconList } from '../../defaults';

export default class StateCuddleToy extends State {
  constructor(params) {
    super(params);
  }

  execute(self, happiness) {
    self.showMotive(motiveIconList.cuddleToy);
    const maxMotive = self.getMaxMotive();
    if (happiness < maxMotive) {
      self.setEmotion(emotionList.happy, happiness + 1);
    }
  }
}
