import { emotionList } from '../defaults';

export class EmotionManager {
  update(self) {
    const emotions = self.getEmotions();
    const state = self.getState();

    for(const emotion in emotions) {
      if (!state.suppressEmotionDecay.includes(emotionList[emotion])) {
        this.setEmotion(self, emotionList[emotion], emotions[emotion] - 1);
      }
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
