import State from './State';
import { stateList, emotionList } from '../../defaults';

export default class StateSeekItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.seekItem;
    this.suppressEmotionDecay.push(emotionList.sad);
  }

  execute(self, motive) {
    if (motive) {
      self.showMotive(motive);
    }
  }
}
