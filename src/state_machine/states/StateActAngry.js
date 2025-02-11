import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StateActAngry extends State {
  constructor(params) {
    super(params);

    this.name = stateList.actAngry;
    this.suppressEmotionDecay.push(emotionList.angry);
  }

  execute(self) {
    self.showMotive(motiveIconList.angry);
  }
}
