import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanPetAnnoyed extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.petAnnoyed;
  }

  execute(self) {
    self.setPlan(planList.petAnnoyed);
    self.setState(stateList.petAnnoyed);
    self.status.state.execute(self);
  }
}
