import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StatePetAnnoyed extends State {
  constructor(params) {
    super(params);

    this.name = stateList.petAnnoyed;
    this.suppressEmotionDecay.push(emotionList.angry);
  }

  execute(self) {
    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoalName()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const emotions = goal.getEmotions();
    if (!emotions) {
      console.error(`Error: no valid emotions found for ${this.name}`);
      return;
    }

    self.showMotive(motiveIconList.petAnnoyed);
    for (let emotion in emotions) {
      if (emotions[emotion] !== null) {
        self.emotionManager.setEmotion(self, emotion, emotions[emotion]);
      }
    }
  }
}
