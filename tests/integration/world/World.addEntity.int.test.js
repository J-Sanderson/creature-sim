/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Water from '../../../src/entities/items/Water';

describe('addEntity', () => {
  test('adds entity of the provided type', () => {
    const el = document.createElement('div');
    const world = new World(el);

    world.entities.items.clear();
    world.addEntity(Water, { xPos: 0, yPos: 0 });

    const items = world.getItems();
    expect(items.values().next().value).toBeInstanceOf(Water);
  });
});
