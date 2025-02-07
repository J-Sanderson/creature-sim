import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanBounceToy extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.bounceToy;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.happy)) {
      console.error(`Error: no ${emotionList.happy} motive found`);
      return;
    }

    self.setPlan(planList.bounceToy);
    self.setState(stateList.bounceToy);
    self.status.state.execute(self);
  }
}
