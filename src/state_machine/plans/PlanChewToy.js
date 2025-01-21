import { planList, stateList, emotionList } from '../../defaults';

export const planChewToy = function (self) {
  const emotions = self.getEmotions();
  if (!emotions.hasOwnProperty(emotionList.happy)) {
    console.error(`Error: no ${emotionList.happy} motive found`);
    return;
  }

  self.setPlan(planList.chewToy);
  self.setState(stateList.chewToy);
  self.status.state.execute(self, emotions[emotionList.happy]);
};
