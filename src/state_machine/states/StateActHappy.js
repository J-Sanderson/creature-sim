import State from "./State";
import { stateList, motiveIconList } from "../../defaults";

export default class StateActHappy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.actHappy;
  }

  execute(self) {
    self.showMotive(motiveIconList.happy);
  }
}