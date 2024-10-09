import Entity from '../Entity';

export class Item extends Entity {
    static adjectives = [Entity.adjectiveList.inanimate];
  
    constructor(world, params = {}) {
      super(world, params);
      this.properties.adjectives.push(...Item.adjectives);
    }
  }
  