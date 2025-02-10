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
      this.setEmotion(self, emotionList.happy, emotions[emotionList.happy] - 1);
    }
  }

  setEmotion(self, emotion, value) {
    if (!self.status.emotions.hasOwnProperty(emotion)) {
      console.error('Invalid emotion');
      return;
    }
    if (value < 0) return;
    const maxMotive = self.getMaxMotive();
    self.status.emotions[emotion] = value > maxMotive ? maxMotive : value;
  }
}
