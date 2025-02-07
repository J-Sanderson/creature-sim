import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanMoveToToybox extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.moveToToybox;
  }

  execute(self) {
    self.setPlan(planList.moveToToybox);
    self.setState(stateList.moveToToybox);
    self.status.state.execute(self);
  }
}
