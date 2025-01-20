import { stateList, emotionList, motiveIconList } from '../../defaults';

export const stateCuddleToy = function (self, happiness) {
  self.setState(stateList.cuddleToy);
  self.showMotive(motiveIconList.cuddleToy);
  const maxMotive = self.getMaxMotive();
  if (happiness < maxMotive) {
    self.setEmotion(emotionList.happy, happiness + 1);
  }
};
