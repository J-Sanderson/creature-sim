import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanSnubItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.snubItem;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.angry)) {
      console.error(`Error: no ${emotionList.angry} motive found`);
      return;
    }

    self.setState(stateList.snubItem);
    self.getState().execute(self, emotions[emotionList.angry]);
  }
}
