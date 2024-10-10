import Entity from '../Entity';
import { adjectiveList } from '../../defaults';

export class Item extends Entity {
  static adjectives = [adjectiveList.inanimate];

  constructor(world, params = {}) {
    super(world, params);
    this.properties.adjectives.push(...Item.adjectives);
  }
}
