import { planList, emotionList } from '../../defaults';

export const planCuddleToy = function (self) {
  const emotions = self.getEmotions();
  if (!emotions.hasOwnProperty(emotionList.happy)) {
    console.error(`Error: no ${emotionList.happy} motive found`);
    return;
  }

  self.setPlan(planList.cuddleToy);
  self.states.stateCuddleToy(self, emotions[emotionList.happy]);
};
