import { Item } from './Item';
import {
  adjectiveList,
  flavorList,
  colorList,
  motiveList,
} from '../../defaults';

export default class Fish extends Item {
  static icon = '&#x1F41F;';
  static className = 'Fish';
  static adjectives = [adjectiveList.tasty];
  static flavors = [flavorList.fish];
  static colors = [colorList.blue, colorList.white];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Fish.adjectives);
    this.properties.flavors.push(...Fish.flavors);
    this.properties.colors.push(...Fish.colors);
    this.icon = Fish.icon;

    this.status.motives[motiveList.amount] = this.maxMotive * 1.5;

    this.setIcon();
  }
}
