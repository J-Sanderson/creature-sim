/**
 * @jest-environment jsdom
 */
const maxX = 5;
const maxY = 6;
jest.mock('../../../src/world/World', () => {
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
      return { x: maxX, y: maxY };
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';
import worldManager from '../../../src/managers/WorldManager';

describe('setXPosition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sets x position to 0 if passed position less than 0', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const pos = -5;

    entity.setXPosition(pos);
    expect(entity.status.position.x).toBe(0);
  });

  test('sets x position to max x bound if passed position is greater', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const pos = 10;

    entity.setXPosition(pos);
    expect(entity.status.position.x).toBe(maxX);
  });

  test('sets x position to given value where within bounds', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const pos = 3;

    entity.setXPosition(pos);
    expect(entity.status.position.x).toBe(pos);
  });
});

describe('setYPosition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sets y position to 0 if passed position less than 0', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const pos = -5;

    entity.setYPosition(pos);
    expect(entity.status.position.y).toBe(0);
  });

  test('sets y position to max y bound if passed position is greater', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const pos = 10;

    entity.setYPosition(pos);
    expect(entity.status.position.y).toBe(maxY);
  });

  test('sets y position to given value where within bounds', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const entity = new Entity('w-1');
    const pos = 3;

    entity.setYPosition(pos);
    expect(entity.status.position.y).toBe(pos);
  });
});
