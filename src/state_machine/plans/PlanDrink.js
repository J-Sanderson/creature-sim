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

    self.setState(stateList.drink);
    self.getState().execute(self, hydration, maxVal);
  }
}
