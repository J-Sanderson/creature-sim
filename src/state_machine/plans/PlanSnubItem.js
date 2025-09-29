import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanSnubItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.snubItem;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.angry)) {
      console.error(`Error: no ${emotionList.angry} motive found`);
      return;
    }

    const goal = self.goalManager.getCurrentGoal();
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const increment = 5;
    const value = emotions[emotionList.angry] + increment;
    goal.setEmotion(self, {
      name: emotionList.angry,
      value,
    });

    self.setState(stateList.snubItem);
    self.getState().execute(self);
  }
}
