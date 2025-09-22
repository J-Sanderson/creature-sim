import Plan from './Plan';
import { motiveList, planList, stateList } from '../../defaults';

export default class PlanDrink extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.drink;
  }

  execute(self) {
    const hydration = self.getMotive(motiveList.hydration);
    const maxVal = self.getMaxMotive();
    if (hydration >= maxVal) {
      return;
    }

    const goal = self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
    if (!goal) {
      console.error(`Error: no valid goal found for ${this.name}`);
      return;
    }

    const motives = goal.getMotives();
    if (!motives) {
      console.error(`Error: no valid motives found for ${this.name}`);
      return;
    }

    const increment = 20;
    const value = motives[motiveList.hydration] + increment;
    goal.setMotive(self, {
      name: motiveList.hydration,
      value,
    });

    self.setState(stateList.drink);
    self.getState().execute(self);
  }
}
