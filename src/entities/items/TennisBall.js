import { Item } from './Item';
import { adjectiveList, colorList } from '../../defaults';

export default class TennisBall extends Item {
  static icon = '&#x1F3BE;';
  static className = 'TennisBall';
  static adjectives = [adjectiveList.chew, adjectiveList.bounce];
  static colors = [colorList.white, colorList.green];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...TennisBall.adjectives);
    this.icon = TennisBall.icon;

    this.setIcon();
  }
}
