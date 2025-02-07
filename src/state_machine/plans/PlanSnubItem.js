import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanSnubItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.snubItem;
  }

  execute(self) {
    self.setPlan(planList.snubItem);
    self.setState(stateList.snubItem);
    self.status.state.execute(self);
  }
}
