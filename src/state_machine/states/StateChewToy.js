import State from './State';
import { emotionList, motiveIconList, stateList } from '../../defaults';

export default class StateChewToy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.chewToy;
    this.suppressEmotionDecay.push(emotionList.happy);
  }

  
  execute(self) {
    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const emotions = goal.getEmotions();
    if (!emotions) {
      console.error(`Error: no valid emotions found for ${this.name}`);
      return;
    }

    self.showMotive(motiveIconList.chewToy);
    for (let emotion in emotions) {
      if (emotions[emotion] !== null) {
        self.emotionManager.setEmotion(self, emotion, emotions[emotion]);
      }
    }
  }
}
