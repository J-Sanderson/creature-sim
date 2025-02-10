import State from "./State";
import { stateList, motiveIconList, emotionList } from "../../defaults";

export default class StateActSad extends State {
  constructor(params) {
    super(params);

    this.name = stateList.actSad;
    this.suppressEmotionDecay.push(emotionList.sad);
  }

  execute(self) {
    self.showMotive(motiveIconList.sad);
  }
}