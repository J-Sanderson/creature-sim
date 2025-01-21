import { planList, stateList, motiveList } from '../../defaults';

export const planPassOut = function (self) {
  const energy = self.getMotive(motiveList.energy);
  const maxMotive = self.getMaxMotive();
  const motiveModifier = 0.1;
  const maxVal = maxMotive * motiveModifier;
  if (energy >= maxVal) {
    self.setPlan('');
    return;
  }

  self.setPlan(planList.passOut);
  self.setState(stateList.passOut);
  self.status.state.execute(self, energy, maxVal);
};
