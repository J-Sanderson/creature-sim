/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';

describe('constructor', () => {
  test('entity bounds match world bounds', () => {
    const el = document.createElement('div');
    const world = new World(el);

    const entity = new Entity(world.getGUID());
    expect(entity.bounds).toEqual(world.getBounds());
  });
});
