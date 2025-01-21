import { planList, stateList, emotionList } from '../../defaults';

export const planBounceToy = function (self) {
  const emotions = self.getEmotions();
  if (!emotions.hasOwnProperty(emotionList.happy)) {
    console.error(`Error: no ${emotionList.happy} motive found`);
    return;
  }

  self.setPlan(planList.bounceToy);
  self.setState(stateList.bounceToy);
  self.status.state.execute(self, emotions[emotionList.happy]);
};
