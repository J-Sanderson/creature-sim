import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanActAngry extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.actAngry;
  }

  execute(self) {
    self.setState(stateList.actAngry);
    self.getState().execute(self);
  }
}
