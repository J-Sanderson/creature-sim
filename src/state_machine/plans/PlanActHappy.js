import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanActHappy extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.addedItem;
  }

  execute(self) {
    self.setState(stateList.actHappy);
    self.getState().execute(self);
  }
}
