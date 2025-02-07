import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanMissingItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.missingItem;
  }

  execute(self) {
    self.setState(stateList.missingItem);
    self.getState().execute(self);
  }
}
