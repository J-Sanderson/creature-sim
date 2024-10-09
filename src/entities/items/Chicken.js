import { Item } from "./Item";

export default class Chicken extends Item {
    static icon = "&#x1F357;";
    static className = "Chicken";
    static adjectives = [Chicken.adjectiveList.tasty];
    static flavors = [Chicken.flavorList.chicken];
    static colors = [Chicken.colorList.white, Chicken.colorList.brown];
  
    constructor(world, params = {}) {
      super(world, params);
      this.properties.adjectives.push(...Chicken.adjectives);
      this.properties.flavors.push(...Chicken.flavors);
      this.properties.colors.push(...Chicken.colors);
      this.icon = Chicken.icon;
  
      this.status.motives[Chicken.motiveList.amount] = this.maxMotive * 1.5;
  
      this.setIcon();
    }
  }