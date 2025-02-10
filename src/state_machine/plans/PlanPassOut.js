import Plan from './Plan';
import { planList, stateList, motiveList, emotionList } from '../../defaults';

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

    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.sad)) {
      console.error(`Error: no ${emotionList.sad} motive found`);
      return;
    }
  
    self.setState(stateList.passOut);
    self.getState().execute(self, energy, emotions[emotionList.sad], maxVal);
  }
}
