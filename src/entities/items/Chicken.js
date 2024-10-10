import { Item } from './Item';
import {
  adjectiveList,
  flavorList,
  colorList,
  motiveList,
} from '../../defaults';

export default class Chicken extends Item {
  static icon = '&#x1F357;';
  static className = 'Chicken';
  static adjectives = [adjectiveList.tasty];
  static flavors = [flavorList.chicken];
  static colors = [colorList.white, colorList.brown];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Chicken.adjectives);
    this.properties.flavors.push(...Chicken.flavors);
    this.properties.colors.push(...Chicken.colors);
    this.icon = Chicken.icon;

    this.status.motives[motiveList.amount] = this.maxMotive * 1.5;

    this.setIcon();
  }
}
