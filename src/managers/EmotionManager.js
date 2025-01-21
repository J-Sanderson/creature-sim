import { emotionList } from '../defaults';

export class EmotionManager {
  update(self) {
    const emotions = self.getEmotions();
    const state = self.getState();

    // happiness decay
    if (
      !state.suppressEmotionDecay.includes(emotionList.happy) &&
      emotions[emotionList.happy] > 0
    ) {
      self.setEmotion(emotionList.happy, emotions[emotionList.happy] - 1);
    }
  }
}
