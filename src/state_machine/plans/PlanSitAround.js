import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanSitAround extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.sitAround;
  }

  execute(self) {
    self.setState(stateList.sitAround);
    self.getState().execute(self);
  }
}
