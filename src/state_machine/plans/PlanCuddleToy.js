import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanCuddleToy extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.cuddleToy;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.happy)) {
      console.error(`Error: no ${emotionList.happy} motive found`);
      return;
    }

    self.setState(stateList.cuddleToy);
    self.getState().execute(self, emotions[emotionList.happy]);
  }
}
