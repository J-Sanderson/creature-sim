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
import Entity from '../../../../src/entities/Entity';
import items from '../../../../src/entities/items';
import { motiveList } from '../../../../src/defaults';

describe.each(items)('%s constructor', (ItemClass) => {
  test('applies static adjectives where applicable', () => {
    if (ItemClass.adjectives) {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const item = new ItemClass('w-1');

      ItemClass.adjectives.forEach((adjective) => {
        expect(item.getAdjectives()).toContain(adjective);
      });
    }
  });

  test('applies static colors where applicable', () => {
    if (ItemClass.colors) {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const item = new ItemClass('w-1');

      ItemClass.colors.forEach((color) => {
        expect(item.getColors()).toContain(color);
      });
    }
  });

  test('applies static flavors where applicable', () => {
    if (ItemClass.flavors) {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const item = new ItemClass('w-1');

      ItemClass.flavors.forEach((flavor) => {
        expect(item.getFlavors()).toContain(flavor);
      });
    }
  });

  test('applies static icon', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const item = new ItemClass('w-1');

    expect(item.icon).toBe(ItemClass.icon);
  });

  test('adds amount motive to status if modifier present', () => {
    if (ItemClass.amountModifier) {
      jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
      const item = new ItemClass('w-1');

      expect(item.getMotives()).toHaveProperty(motiveList.amount);
      expect(item.getMotive(motiveList.amount)).toEqual(
        item.maxMotive * ItemClass.amountModifier
      );
    }
  });

  test('runs setIcon', () => {
    const setIcon = jest
      .spyOn(Entity.prototype, 'setIcon')
      .mockImplementation(() => {});
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    new ItemClass('w-1');

    expect(setIcon).toHaveBeenCalledTimes(1);
  });
});
