import { Item } from './Item';

export default class TeddyBear extends Item {
  static icon = '&#x1F9F8;';
  static className = 'TeddyBear';
  static adjectives = [
    TeddyBear.adjectiveList.chew,
    TeddyBear.adjectiveList.soft,
  ];
  static colors = [TeddyBear.colorList.brown];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...TeddyBear.adjectives);
    this.icon = TeddyBear.icon;

    this.setIcon();
  }
}
