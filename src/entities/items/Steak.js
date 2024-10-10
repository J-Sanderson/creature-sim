import { Item } from './Item';
import {
  adjectiveList,
  flavorList,
  colorList,
  motiveList,
} from '../../defaults';

export default class Steak extends Item {
  static icon = '&#x1F969;';
  static className = 'Steak';
  static adjectives = [adjectiveList.tasty];
  static flavors = [flavorList.beef];
  static colors = [colorList.red];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Steak.adjectives);
    this.properties.flavors.push(...Steak.flavors);
    this.properties.colors.push(...Steak.colors);
    this.icon = Steak.icon;

    this.status.motives[motiveList.amount] = this.maxMotive * 1.5;

    this.setIcon();
  }
}
