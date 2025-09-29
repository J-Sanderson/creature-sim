import Plan from './Plan';
import {
  motiveList,
  goalList,
  planList,
  stateList,
  emotionList,
} from '../../defaults';

export default class PlanEat extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.eat;
  }

  execute(self) {
    const motives = self.getMotives();
    if (!motives.hasOwnProperty(motiveList.fullness)) {
      console.error(`Error: no ${motiveList.fullness} motive found`);
      return;
    }
    if (motives[motiveList.hydration] < 10) {
      self.goalManager.addGoal(self, goalList.drink, {
        priority: 1,
        suspended: false,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
      self.goalManager.suspendGoal(goalList.eat);
    }
    const maxMotive = self.getMaxMotive();
    if (motives[motiveList.fullness] >= maxMotive) {
      return;
    }

    const item = self.queries.getItemFromWorld(
      self,
      self.getGoals()[goalList.eat].getTarget()
    );
    if (!item) {
      self.goalManager.deleteGoal(goalList.eat);
    }
    const goal = self.goalManager.getCurrentGoal();
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }
    if (item.getFlavors().includes(self.getFavorites().flavor)) {
      const emotions = self.getEmotions();
      if (!emotions.hasOwnProperty(emotionList.happy)) {
        console.error(`Error: no ${emotionList.happy} motive found`);
        return;
      }

      const increment = 1;
      const value = emotions[emotionList.happy] + increment;
      goal.setEmotion(self, {
        name: emotionList.happy,
        value,
      });
    }

    let increment = 10;
    let value = motives[motiveList.fullness] + increment;
    goal.setMotive(self, {
      name: motiveList.fullness,
      value,
    });

    increment = -1;
    value = motives[motiveList.hydration] + increment;
    goal.setMotive(self, {
      name: motiveList.hydration,
      value,
    });

    self.setState(stateList.eat);
    self.getState().execute(self);
  }
}
