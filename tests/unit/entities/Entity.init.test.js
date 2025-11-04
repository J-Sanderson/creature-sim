/**
 * @jest-environment jsdom
 */
const cellSize = 10;
const lineWidth = 1;
jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive: 100, cellSize, lineWidth };
    }
    getParam(param) {
      return this.params[param];
    }
    displayEntity() {
      return jest.fn();
    }
    getBounds() {
      return {x: 5, y: 5}
    }
  };
  return { __esModule: true, World: MockWorld };
});

import { World as MockWorld, World } from '../../../src/world/World';
import Entity from '../../../src/entities/Entity';
import worldManager from '../../../src/managers/WorldManager';

describe('init', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates icon element and adds to outputs', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const world = 'w-1';
    const entity = new Entity(world);

    expect(entity.outputs).toHaveProperty('icon');
  });

  test('sets icon element class', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const world = 'w-1';
    const entity = new Entity(world);

    expect(Array.from(entity.outputs.icon.classList)).toContain('entity');
  });

  test('sets correct icon size', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const world = 'w-1';
    const entity = new Entity(world);
    const size = `${cellSize}px`;

    expect(entity.outputs.icon.style.width).toBe(size);
    expect(entity.outputs.icon.style.height).toBe(size);
  });

  test('positions icon at top left if no params passed', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const world = 'w-1';
    const entity = new Entity(world);
    const pos = `${lineWidth}px`;

    expect(entity.outputs.icon.style.left).toBe(pos);
    expect(entity.outputs.icon.style.top).toBe(pos);
  });

  test('positions icon using x position if passed', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const x = 5;
    const entity = new Entity('w-1', { xPos: x });

    expect(entity.outputs.icon.style.left).toBe(
      `${x * cellSize + lineWidth}px`
    );
    expect(entity.outputs.icon.style.top).toBe(`${lineWidth}px`);
  });

  test('positions icon using y position if passed', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const y = 6;
    const entity = new Entity('w-1', { yPos: y });

    expect(entity.outputs.icon.style.left).toBe(`${lineWidth}px`);
    expect(entity.outputs.icon.style.top).toBe(`${y * cellSize + lineWidth}px`);
  });

  test('positions icon using x and y positions if both provided', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const x = 5;
    const y = 6;
    const entity = new Entity('w-1', { xPos: x, yPos: y });

    expect(entity.outputs.icon.style.left).toBe(
      `${x * cellSize + lineWidth}px`
    );
    expect(entity.outputs.icon.style.top).toBe(`${y * cellSize + lineWidth}px`);
  });

  test('runs displayEntity', () => {
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
    const displayEntity = jest
      .spyOn(World.prototype, 'displayEntity')
      .mockImplementation(() => {});
    const entity = new Entity('w-1');

    expect(displayEntity).toHaveBeenCalledTimes(1);
    expect(displayEntity).toHaveBeenCalledWith(entity.outputs.icon);
  });
});
