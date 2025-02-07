import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanSnubItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.snubItem;
  }

  execute(self) {
    self.setState(stateList.snubItem);
    self.getState().execute(self);
  }
}
