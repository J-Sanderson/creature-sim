import { Item } from './Item';

export default class Bone extends Item {
  static icon = '&#x1F9B4;';
  static className = 'Bone';
  static adjectives = [Bone.adjectiveList.chew];
  static colors = [Bone.colorList.white];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Bone.adjectives);
    this.properties.colors.push(...Bone.colors);
    this.icon = Bone.icon;

    this.setIcon();
  }
}
