import Plan from './Plan';
import { planList, stateList, motiveList, emotionList } from '../../defaults';

export default class PlanPassOut extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.passOut;
  }

  execute(self) {
    const energy = self.getMotive(motiveList.energy);
    const maxMotive = self.getMaxMotive();
    const motiveModifier = 0.1;
    const maxVal = maxMotive * motiveModifier;
    if (energy >= maxVal) {
      self.setPlan('');
      return;
    }

    const goal = self.goalManager.getCurrentGoal()
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.sad)) {
      console.error(`Error: no ${emotionList.sad} motive found`);
      return;
    }

    const motives = goal.getMotives();
    if (!motives) {
      console.error(`Error: no valid motives found for ${this.name}`);
      return;
    }

    let increment = 1;
    let value = motives[motiveList.energy] + increment;
    goal.setMotive(self, {
      name: motiveList.energy,
      value,
    });

    increment = 2;
    value = emotions[emotionList.sad] + increment;
    goal.setEmotion(self, {
      name: emotionList.sad,
      value,
    });

    self.setState(stateList.passOut);
    self.getState().execute(self);
  }
}
