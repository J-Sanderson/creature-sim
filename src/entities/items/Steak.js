import { Item } from "./Item";

export default class Steak extends Item {
    static icon = "&#x1F969;";
    static className = "Steak";
    static adjectives = [Steak.adjectiveList.tasty];
    static flavors = [Steak.flavorList.beef];
    static colors = [Steak.colorList.red];
  
    constructor(world, params = {}) {
      super(world, params);
      this.properties.adjectives.push(...Steak.adjectives);
      this.properties.flavors.push(...Steak.flavors);
      this.properties.colors.push(...Steak.colors);
      this.icon = Steak.icon;
  
      this.status.motives[Steak.motiveList.amount] = this.maxMotive * 1.5;
  
      this.setIcon();
    }
  }