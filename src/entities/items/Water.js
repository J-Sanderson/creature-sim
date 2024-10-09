import { Item } from './Item';

export default class Water extends Item {
  static icon = '&#x1F4A7;';
  static className = 'Water';
  static adjectives = [Water.adjectiveList.wet];
  static flavors = [Water.flavorList.water];
  static colors = [Water.colorList.blue];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Water.adjectives);
    this.properties.flavors.push(...Water.flavors);
    this.properties.colors.push(...Water.colors);
    this.icon = Water.icon;

    this.status.motives[Water.motiveList.amount] = this.maxMotive * 2.5;

    this.setIcon();
  }
}
