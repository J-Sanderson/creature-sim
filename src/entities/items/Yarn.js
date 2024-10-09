import { Item } from './Item';

export default class Yarn extends Item {
  static icon = '&#x1F9F6;';
  static className = 'Yarn';
  static adjectives = [
    Yarn.adjectiveList.chew,
    Yarn.adjectiveList.bounce,
    Yarn.adjectiveList.soft,
  ];
  static colors = [Yarn.colorList.red];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Yarn.adjectives);
    this.icon = Yarn.icon;

    this.setIcon();
  }
}
