import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanPetAnnoyed extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.petAnnoyed;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.angry)) {
      console.error(`Error: no ${emotionList.angry} motive found`);
      return;
    }

    self.setState(stateList.petAnnoyed);
    self.getState().execute(self, emotions[emotionList.angry]);
  }
}
