import Plan from './Plan';
import { planList, stateList, motiveList } from '../../defaults';

export default class PlanPassOut extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.passOut;
  }

  execute(self) {
    const energy = self.getMotive(motiveList.energy);
    const maxMotive = self.getMaxMotive();
    const motiveModifier = 0.1;
    const maxVal = maxMotive * motiveModifier;
    if (energy >= maxVal) {
      self.setPlan('');
      return;
    }
  
    self.setState(stateList.passOut);
    self.getState().execute(self, energy, maxVal);
  }
}
