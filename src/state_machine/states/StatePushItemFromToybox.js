import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StatePushItemFromToybox extends State {
  constructor(params) {
    super(params);
  }

  execute(self) {
    self.showMotive(motiveIconList.pushItemFromToybox);
  }
}
