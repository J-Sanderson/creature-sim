import { Item } from './Item';
import { adjectiveList, colorList } from '../../defaults';

export default class Basketball extends Item {
  static icon = '&#x1F3C0;';
  static className = 'Basketball';
  static adjectives = [adjectiveList.chew, adjectiveList.bounce];
  static colors = [colorList.orange];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Basketball.adjectives);
    this.icon = Basketball.icon;

    this.setIcon();
  }
}
