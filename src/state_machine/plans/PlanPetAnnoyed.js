import Plan from './Plan';
import { planList, stateList } from '../../defaults';

export default class PlanPetAnnoyed extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.petAnnoyed;
  }

  execute(self) {
    self.setState(stateList.petAnnoyed);
    self.getState().execute(self);
  }
}
