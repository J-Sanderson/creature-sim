import Plan from './Plan';
import { planList, stateList, emotionList } from '../../defaults';

export default class PlanMissingItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.missingItem;
  }

  execute(self) {
    const emotions = self.getEmotions();
    if (!emotions.hasOwnProperty(emotionList.sad)) {
      console.error(`Error: no ${emotionList.sad} motive found`);
      return;
    }

    self.setState(stateList.missingItem);
    self.getState().execute(self, emotions[emotionList.sad]);
  }
}
