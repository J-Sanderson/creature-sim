import { planList, stateList, emotionList } from '../../defaults';

export const planCuddleToy = function (self) {
  const emotions = self.getEmotions();
  if (!emotions.hasOwnProperty(emotionList.happy)) {
    console.error(`Error: no ${emotionList.happy} motive found`);
    return;
  }

  self.setPlan(planList.cuddleToy);
  self.setState(stateList.cuddleToy);
  self.status.state.execute(self, emotions[emotionList.happy]);
};
