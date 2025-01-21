import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StatePetAnnoyed extends State {
  constructor(params) {
    super(params);
  }

  execute(self) {
    self.showMotive(motiveIconList.petAnnoyed);
  }
}
