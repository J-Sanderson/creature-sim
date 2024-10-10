import { Item } from './Item';
import {
  adjectiveList,
  flavorList,
  colorList,
  motiveList,
} from '../../defaults';

export default class Water extends Item {
  static icon = '&#x1F4A7;';
  static className = 'Water';
  static adjectives = [adjectiveList.wet];
  static flavors = [flavorList.water];
  static colors = [colorList.blue];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Water.adjectives);
    this.properties.flavors.push(...Water.flavors);
    this.properties.colors.push(...Water.colors);
    this.icon = Water.icon;

    this.status.motives[motiveList.amount] = this.maxMotive * 2.5;

    this.setIcon();
  }
}
