import { Item } from './Item';
import { adjectiveList, colorList } from '../../defaults';

export default class Yarn extends Item {
  static icon = '&#x1F9F6;';
  static className = 'Yarn';
  static adjectives = [
    adjectiveList.chew,
    adjectiveList.bounce,
    adjectiveList.soft,
  ];
  static colors = [colorList.red];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Yarn.adjectives);
    this.icon = Yarn.icon;

    this.setIcon();
  }
}
