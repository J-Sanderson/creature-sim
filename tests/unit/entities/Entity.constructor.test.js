const maxMotive = 100;
const x = 5;
const y = 6;
jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive };
    }
    getParam(param) {
      return this.params[param];
    }
    getBounds() {
      return {x, y}
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';
import worldManager from '../../../src/managers/WorldManager';
import { utilities } from '../../../src/utils/Utilities';

describe('constructor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fails if world does not exist', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(undefined);
    const init = jest
      .spyOn(Entity.prototype, 'init')
      .mockImplementation(() => {});

    const world = 'not-a-world';
    const entity = new Entity(world);

    expect(entity.world).toBeUndefined();
    expect(entity.order).toBeUndefined();
    expect(entity.guid).toBeUndefined();
    expect(entity.outputs).toBeUndefined();
    expect(entity.eventHandlers).toBeUndefined();
    expect(entity.properties).toBeUndefined();
    expect(entity.maxMotive).toBeUndefined();
    expect(entity.status).toBeUndefined();
    expect(err).toHaveBeenCalledTimes(1);
    expect(err).toHaveBeenCalledWith(
      `Error: ${world} is not a valid World object`
    );
    expect(init).not.toHaveBeenCalled();
  });

  test('sets world id', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const world = 'w-1';
    const entity = new Entity(world);

    expect(entity.world).toBe(world);
  });

  test('sets order', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    expect(entity.order).toBe(1);
  });

  test('generates GUID', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const id = 'entity-1';
    jest.spyOn(utilities, 'generateGUID').mockReturnValue(id);

    const entity = new Entity('w-1');
    expect(typeof entity.guid).toBe('string');
    expect(entity.guid).toBe(id);
  });

  test('creates outputs object', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    expect(entity.outputs).toEqual({});
  });

  test('creates event handlers object', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    expect(entity.eventHandlers).toEqual({});
  });

  test('creates properties object', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');

    const properties = {
      adjectives: [],
      flavors: [],
      colors: [],
    };
    expect(entity.properties).toEqual(properties);
  });

  test('stores bounds from world', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');

    expect(entity.bounds).toEqual({x, y});
  });

  test('sets max motive', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');

    expect(entity.maxMotive).toBe(maxMotive);
  });

  test('sets status with top left position by default', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');

    const status = {
      position: {
        x: 0,
        y: 0,
      },
      motives: {},
    };

    expect(entity.status).toEqual(status);
  });

  test('sets x position with params if passed', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const x = 5;
    const entity = new Entity('w-1', { xPos: x });

    expect(entity.status.position.x).toBe(x);
    expect(entity.status.position.y).toBe(0);
  });

  test('sets y position with params if passed', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const y = 6;
    const entity = new Entity('w-1', { yPos: y });

    expect(entity.status.position.x).toBe(0);
    expect(entity.status.position.y).toBe(y);
  });

  test('sets does not use default position if y and y params both passed', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const x = 5;
    const y = 6;
    const entity = new Entity('w-1', { xPos: x, yPos: y });

    expect(entity.status.position.x).toBe(x);
    expect(entity.status.position.y).toBe(y);
  });

  test('runs init', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const init = jest
      .spyOn(Entity.prototype, 'init')
      .mockImplementation(() => {});

    new Entity('w-1');
    expect(init).toHaveBeenCalledTimes(1);
  });
});
