import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanAddedItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.addedItem;
  }

  execute(self) {
    self.setState(stateList.addedItem);
    self.getState().execute(self);
  }
}
