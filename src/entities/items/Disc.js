import { Item } from './Item';

export default class Disc extends Item {
  static icon = '&#x1F94F;';
  static className = 'Disc';
  static adjectives = [Disc.adjectiveList.chew, Disc.adjectiveList.bounce];
  static colors = [Disc.colorList.blue];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Disc.adjectives);
    this.icon = Disc.icon;

    this.setIcon();
  }
}
