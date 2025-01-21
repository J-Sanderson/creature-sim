import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StatePetHappy extends State {
  constructor(params) {
    super(params);
  }

  execute(self) {
    self.showMotive(motiveIconList.petHappy);
  }
}
