import { Item } from './Item';

export default class TennisBall extends Item {
  static icon = '&#x1F3BE;';
  static className = 'TennisBall';
  static adjectives = [
    TennisBall.adjectiveList.chew,
    TennisBall.adjectiveList.bounce,
  ];
  static colors = [TennisBall.colorList.white, TennisBall.colorList.green];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...TennisBall.adjectives);
    this.icon = TennisBall.icon;

    this.setIcon();
  }
}
