import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanMissingItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.missingItem;
  }

  execute(self) {
    self.setPlan(planList.missingItem);
    self.setState(stateList.missingItem);
    self.status.state.execute(self);
  }
}
