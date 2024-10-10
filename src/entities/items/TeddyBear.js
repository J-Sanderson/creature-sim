import { Item } from './Item';
import { adjectiveList, colorList } from '../../defaults';

export default class TeddyBear extends Item {
  static icon = '&#x1F9F8;';
  static className = 'TeddyBear';
  static adjectives = [adjectiveList.chew, adjectiveList.soft];
  static colors = [colorList.brown];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...TeddyBear.adjectives);
    this.icon = TeddyBear.icon;

    this.setIcon();
  }
}
