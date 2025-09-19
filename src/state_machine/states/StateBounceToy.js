import State from './State';
import { stateList, motiveIconList, emotionList } from '../../defaults';

export default class StateBounceToy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.bounceToy;
    this.suppressEmotionDecay.push(emotionList.happy);
  }

  execute(self) {
    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const emotion = goal.getEmotion();
    if (!emotion) {
      console.error(`Error: no valid emotion found for ${this.name}`);
      return;
    }

    self.showMotive(motiveIconList.bounceToy);
    self.emotionManager.setEmotion(self, emotion.name, emotion.value);
  }
}
