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

    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const maxMotive = self.getMaxMotive();
    const increment = 5;
    const updatedEmotion = emotions[emotionList.angry] + increment;
    goal.setEmotion({
      name: emotionList.angry,
      value: updatedEmotion < maxMotive ? updatedEmotion : maxMotive,
    });

    self.setState(stateList.snubItem);
    self.getState().execute(self);
  }
}
