import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanAddedItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.addedItem;
  }

  execute(self) {
    self.setPlan(planList.addedItem);
    self.setState(stateList.addedItem);
    self.status.state.execute(self);
  }
}
