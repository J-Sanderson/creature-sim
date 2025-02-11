import State from './State';
import {
  stateList,
  motiveList,
  motiveIconList,
  emotionList,
} from '../../defaults';

export default class StatePassOut extends State {
  constructor(params) {
    super(params);

    this.name = stateList.passOut;
    this.suppressMotiveDecay.push(motiveList.energy);
    this.suppressEmotionDecay.push(emotionList.sad);
  }

  execute(self, energy, sadness, maxVal) {
    self.showMotive(motiveIconList.passOut);
    let newVal = (energy += 1);
    if (newVal > maxVal) {
      newVal = maxVal;
    }
    self.setMotive(motiveList.energy, newVal);
    if (sadness < maxVal) {
      self.emotionManager.setEmotion(self, emotionList.sad, sadness + 1);
    }
  }
}
