import { stateList, motiveIconList, emotionList } from '../../defaults';

export const stateBounceToy = function (self, happiness) {
  self.setState(stateList.bounceToy);
  self.showMotive(motiveIconList.bounceToy);
  const maxMotive = self.getMaxMotive();
  if (happiness < maxMotive) {
    self.setEmotion(emotionList.happy, happiness + 1);
  }
};
