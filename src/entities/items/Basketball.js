import { Item } from "./Item";

export default class Basketball extends Item {
    static icon = "&#x1F3C0;";
    static className = "Basketball";
    static adjectives = [Basketball.adjectiveList.chew, Basketball.adjectiveList.bounce];
    static colors = [Basketball.colorList.orange];
  
    constructor(world, params = {}) {
      super(world, params);
      this.properties.adjectives.push(...Basketball.adjectives);
      this.icon = Basketball.icon;
  
      this.setIcon();
    }
  }