import { stateList, emotionList, motiveIconList } from '../../defaults';

export const stateChewToy = function (self, happiness) {
  self.setState(stateList.chewToy);
  self.showMotive(motiveIconList.chewToy);
  const maxMotive = self.getMaxMotive();
  if (happiness < maxMotive) {
    self.setEmotion(emotionList.happy, happiness + 1);
  }
};
