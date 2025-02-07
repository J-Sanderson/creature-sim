import Plan from './Plan';
import { motiveList, goalList, planList, stateList } from '../../defaults';

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
    self.setPlan(planList.eat);
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
    const maxVal = self.getMaxMotive();
    if (motives[motiveList.fullness] >= maxVal) {
      return;
    }
  
    self.setState(stateList.eat);
    self.status.state.execute(self, motives, maxVal);
  }
}
