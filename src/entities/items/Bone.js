import { Item } from './Item';
import { adjectiveList, colorList } from '../../defaults';

export default class Bone extends Item {
  static icon = '&#x1F9B4;';
  static className = 'Bone';
  static adjectives = [adjectiveList.chew];
  static colors = [colorList.white];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Bone.adjectives);
    this.properties.colors.push(...Bone.colors);
    this.icon = Bone.icon;

    this.setIcon();
  }
}
