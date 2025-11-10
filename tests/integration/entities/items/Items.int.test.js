/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from '../../../../src/world/World';
import Entity from '../../../../src/entities/Entity';
import { Item } from '../../../../src/entities/items/Item';
import items from '../../../../src/entities/items';

describe.each(items)('%s constructor', (ItemClass) => {
  test('is instance of Item and Entity', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const item = new ItemClass(world.getGUID());
    expect(item).toBeInstanceOf(Item);
    expect(item).toBeInstanceOf(Entity);
  });
});
