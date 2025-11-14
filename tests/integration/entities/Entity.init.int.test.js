/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';

describe('init', () => {
  test('calls world.displayEntity', () => {
    const displayEntity = jest
      .spyOn(World.prototype, 'displayEntity')
      .mockImplementation(() => {});
    const el = document.createElement('div');
    const world = new World(el);

    const entity = new Entity(world.getGUID());
    expect(displayEntity).toHaveBeenCalledTimes(2);
    expect(displayEntity).toHaveBeenLastCalledWith(entity.outputs.icon);
  });

  test('creates unique entities', () => {
    const el = document.createElement('div');
    const world = new World(el);
    const worldID = world.getGUID();
    const entity1 = new Entity(worldID);
    const entity2 = new Entity(worldID);

    expect(entity1.getGUID()).not.toEqual(entity2.getGUID());
  });
});
