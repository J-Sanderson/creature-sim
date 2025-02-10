import State from "./State";
import { stateList, motiveIconList, emotionList } from "../../defaults";

export default class StateActHappy extends State {
  constructor(params) {
    super(params);

    this.name = stateList.actHappy;
    this.suppressEmotionDecay.push(emotionList.happy);
  }

  execute(self) {
    self.showMotive(motiveIconList.happy);
  }
}