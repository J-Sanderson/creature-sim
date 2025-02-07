import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanChewToy extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.chewToy;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.happy)) {
      console.error(`Error: no ${emotionList.happy} motive found`);
      return;
    }

    self.setPlan(planList.chewToy);
    self.setState(stateList.chewToy);
    self.status.state.execute(self);
  }
}
