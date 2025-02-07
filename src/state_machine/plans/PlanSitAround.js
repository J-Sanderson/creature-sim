import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanSitAround extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.sitAround;
  }

  execute(self) {
    self.setPlan(planList.sitAround);
    self.setState(stateList.sitAround);
    self.status.state.execute(self);
  }
}
