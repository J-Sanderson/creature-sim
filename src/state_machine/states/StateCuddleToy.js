import State from './State';
import { stateList, emotionList, motiveIconList } from '../../defaults';

export default class StateCuddleToy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.cuddleToy;
    this.suppressEmotionDecay.push(emotionList.happy);
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

    self.showMotive(motiveIconList.cuddleToy);
    for (let emotion in emotions) {
      if (emotions[emotion] !== null) {
        self.emotionManager.setEmotion(self, emotion, emotions[emotion]);
      }
    }
  }
}
