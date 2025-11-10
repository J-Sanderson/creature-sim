/**
 * @jest-environment jsdom
 */

const maxMotive = 100;
jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive, lineWidth: 1, cellSize: 10 };
    }
    getParam(param) {
      return this.params[param];
    }
    getBounds() {
      return { x: 5, y: 5 };
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';
import worldManager from '../../../src/managers/WorldManager';

describe('setMotive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    jest.spyOn(Entity.prototype, 'init').mockImplementation(function () {});
  });

  test('displays error if invalid motive passed', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const entity = new Entity('w-1');
    const motive = 'not-a-motive';
    entity.setMotive(motive, 50);

    expect(err).toHaveBeenCalledTimes(1);
    expect(err).toHaveBeenCalledWith(`Error: Invalid motive ${motive}`);
  });

  test('updates given motive if present', () => {
    const entity = new Entity('w-1');
    const motive = 'fullness';
    const amount = 50;
    entity.status.motives[motive] = 0;
    entity.setMotive(motive, amount);

    expect(entity.status.motives[motive]).toBe(amount);
  });

  test('sets motive to 0 if passed a negative', () => {
    const entity = new Entity('w-1');
    const motive = 'fullness';
    const amount = -50;
    entity.status.motives[motive] = 50;
    entity.setMotive(motive, amount);

    expect(entity.status.motives[motive]).toBe(0);
  });

  test('sets motive to maxMotive if passed a greater value', () => {
    const entity = new Entity('w-1');
    const motive = 'fullness';
    const amount = 150;
    entity.status.motives[motive] = 0;
    entity.setMotive(motive, amount);

    expect(entity.status.motives[motive]).toBe(maxMotive);
  });
});
