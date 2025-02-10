import State from './State';
import { stateList, emotionList } from '../../defaults';

export default class StateSeekItem extends State {
  constructor(params) {
    super(params);

    this.name = stateList.seekItem;
    this.suppressEmotionDecay.push(emotionList.sad);
  }

  execute(self, motive) {
    const emotions = self.getEmotions();
    self.emotionManager.setEmotion(self, emotionList.happy, emotions[emotionList.happy] - 1);
    self.emotionManager.setEmotion(self, emotionList.sad, emotions[emotionList.sad] + 1);

    if (motive) {
      self.showMotive(motive);
    }
  }
}
