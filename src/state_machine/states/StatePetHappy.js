import State from './State';
import { stateList, motiveIconList } from '../../defaults';

export default class StatePetHappy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.petHappy;
  }

  execute(self) {
    self.showMotive(motiveIconList.petHappy);
  }
}
