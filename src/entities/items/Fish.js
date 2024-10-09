import { Item } from "./Item";

export default class Fish extends Item {
    static icon = "&#x1F41F;";
    static className = "Fish";
    static adjectives = [Fish.adjectiveList.tasty];
    static flavors = [Fish.flavorList.fish];
    static colors = [Fish.colorList.blue, Fish.colorList.white];
  
    constructor(world, params = {}) {
      super(world, params);
      this.properties.adjectives.push(...Fish.adjectives);
      this.properties.flavors.push(...Fish.flavors);
      this.properties.colors.push(...Fish.colors);
      this.icon = Fish.icon;
  
      this.status.motives[Fish.motiveList.amount] = this.maxMotive * 1.5;
  
      this.setIcon();
    }
  }