/**
 * @jest-environment jsdom
 */
jest.mock('../../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive: 100, lineWidth: 1, cellSize: 10 };
    }
    getParam(param) {
      return this.params[param];
    }
    displayEntity() {
      return jest.fn();
    }
    getBounds() {
      return { x: 5, y: 5 };
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld } from '../../../../src/world/World';
import worldManager from '../../../../src/managers/WorldManager';
import { Item } from '../../../../src/entities/items/Item';
import { adjectiveList } from '../../../../src/defaults';

describe('constructor', () => {
  test('contains inanimate adjective', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const item = new Item('w-1');

    expect(item.getAdjectives()).toContain(adjectiveList.inanimate);
  });

  test('does not contain animate adjective', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const item = new Item('w-1');

    expect(item.getAdjectives()).not.toContain(adjectiveList.animate);
  });
});
