/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

const makeEntityCtor = (id = 'e-1', position = { x: 0, y: 0 }) => {
  const Ctor = jest.fn(function (parentGuid, position) {
    this.parentGuid = parentGuid;
    this.position = position;
    this.getGUID = jest.fn(() => id);
  });
  return Ctor;
};

describe('addEntity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(World.prototype, 'init').mockImplementation(function () {});
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error and returns undefined if entity type is not valid', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(function () {});
    const el = document.createElement('div');
    const world = new World(el);
    const entityId = world.addEntity(
      makeEntityCtor,
      { xPos: 0, yPos: 0 },
      'notAnEntityType'
    );

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('Error: invalid entity type');
    expect(entityId).toBeUndefined();
  });

  test('creates entity and adds to items by default', () => {
    const id = 'item-1';
    const worldId = 'world-1';
    const pos = { xPos: 5, yPos: 6 };
    jest.spyOn(World.prototype, 'getGUID').mockReturnValue(worldId);
    const el = document.createElement('div');
    const world = new World(el);
    const EntityCtor = makeEntityCtor(id, pos);
    const entityId = world.addEntity(EntityCtor, pos);
    const instance = EntityCtor.mock.instances[0];

    expect(EntityCtor).toHaveBeenCalledTimes(1);
    expect(EntityCtor).toHaveBeenCalledWith(worldId, pos);
    expect(instance.getGUID).toHaveBeenCalledTimes(1);
    expect(entityId).toBe(id);
    expect(world.getItem(id)).toBe(instance);
    expect(world.getCreature(id)).toBeUndefined();
  });

  test('creates entity and assigns to creatures where specified', () => {
    const id = 'creature-1';
    const worldId = 'world-1';
    const pos = { xPos: 5, yPos: 6 };
    jest.spyOn(World.prototype, 'getGUID').mockReturnValue(worldId);
    const el = document.createElement('div');
    const world = new World(el);
    const EntityCtor = makeEntityCtor(id, pos);
    const entityId = world.addEntity(EntityCtor, pos, 'creatures');
    const instance = EntityCtor.mock.instances[0];

    expect(EntityCtor).toHaveBeenCalledTimes(1);
    expect(EntityCtor).toHaveBeenCalledWith(worldId, pos);
    expect(instance.getGUID).toHaveBeenCalledTimes(1);
    expect(entityId).toBe(id);
    expect(world.getCreature(id)).toBe(instance);
    expect(world.getItem(id)).toBeUndefined();
  });
});
