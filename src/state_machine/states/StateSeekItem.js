import { stateList } from '../../defaults';

export const stateSeekItem = function (self, motive) {
  self.setState(stateList.seekItem);
  if (motive) {
    self.showMotive(motive);
  }
};
