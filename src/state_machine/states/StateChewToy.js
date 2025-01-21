import State from './State';
import { emotionList, motiveIconList } from '../../defaults';

export default class StateChewToy extends State {
  constructor(params) {
    super(params);
  }

  execute(self, happiness) {
    self.showMotive(motiveIconList.chewToy);
    const maxMotive = self.getMaxMotive();
    if (happiness < maxMotive) {
      self.setEmotion(emotionList.happy, happiness + 1);
    }
  }
}
