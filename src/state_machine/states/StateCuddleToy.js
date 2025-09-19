import State from './State';
import { stateList, emotionList, motiveIconList } from '../../defaults';

export default class StateCuddleToy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.cuddleToy;
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

    self.showMotive(motiveIconList.cuddleToy);
    self.emotionManager.setEmotion(self, emotion.name, emotion.value);
  }
}
