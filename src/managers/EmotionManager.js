export class EmotionManager {
  update(self) {
    const emotions = self.getEmotions();
    for (let emotion in emotions) {
      if (emotions[emotion] > 0) {
        self.setEmotion(emotion, emotions[emotion] - 1);
      }
    }
  }
}
