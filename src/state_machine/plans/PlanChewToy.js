import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanChewToy extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.chewToy;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.happy)) {
      console.error(`Error: no ${emotionList.happy} motive found`);
      return;
    }

    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoalName()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const increment = 1;
    const value = emotions[emotionList.happy] + increment;
    goal.setEmotion(self, {
      name: emotionList.happy,
      value,
    });

    self.setState(stateList.chewToy);
    self.getState().execute(self);
  }
}
