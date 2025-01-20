import { emotionList, stateList } from '../defaults';

export class EmotionManager {
  update(self) {
    const emotions = self.getEmotions();
    // happiness decay
    if (
      self.status.state !== stateList.bounceToy &&
      self.status.state !== stateList.chewToy &&
      self.status.state !== stateList.cuddleToy &&
      emotions[emotionList.happy] > 0
    ) {
      self.setEmotion(emotionList.happy, emotions[emotionList.happy] - 1);
    }
  }
}
