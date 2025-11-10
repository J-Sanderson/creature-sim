import { Item } from './Item';
import { adjectiveList, colorList } from '../../defaults';

export default class Disc extends Item {
  static icon = '&#x1F94F;';
  static className = 'Disc';
  static adjectives = [adjectiveList.chew, adjectiveList.bounce];
  static colors = [colorList.blue];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Disc.adjectives);
    this.properties.colors.push(...Disc.colors);
    this.icon = Disc.icon;

    this.setIcon();
  }
}
