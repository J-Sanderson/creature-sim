import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanBounceToy extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.bounceToy;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.happy)) {
      console.error(`Error: no ${emotionList.happy} motive found`);
      return;
    }

    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const maxMotive = self.getMaxMotive();
    const increment = 1;
    const updatedEmotion = emotions[emotionList.happy] + increment;
    goal.setEmotion({
      name: emotionList.happy,
      value: updatedEmotion < maxMotive ? updatedEmotion : maxMotive,
    });

    self.setState(stateList.bounceToy);
    self.getState().execute(self);
  }
}
