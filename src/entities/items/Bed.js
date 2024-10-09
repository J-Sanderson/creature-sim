import { Item } from './Item';

export default class Bed extends Item {
  static icon = '&#x1F6CF;';
  static className = 'Bed';
  static adjectives = [Bed.adjectiveList.restful];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Bed.adjectives);
    this.icon = Bed.icon;

    this.setIcon();
  }
}
