import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanActSad extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.actSad;
  }

  execute(self) {
    self.setState(stateList.actSad);
    self.getState().execute(self);
  }
}
