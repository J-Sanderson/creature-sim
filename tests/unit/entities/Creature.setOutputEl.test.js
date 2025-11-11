/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';

jest.mock('../../../src/world/World', () => {
  const MockWorld = class World {
    constructor() {
      this.params = { maxMotive: 100 };
    }
    getParam(param) {
      return this.params[param];
    }
    displayEntity() {
      return jest.fn();
    }
    getBounds() {
      return { x: 5, y: 6 };
    }
  };
  return { __esModule: true, World: MockWorld };
});

describe('setOutputEl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  test('displays error and does not add to outputs if el is not an element', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const creature = new Creature('w-1');
    const outputType = 'outputType';
    const el = 'not-an-element';
    creature.setOutputEl(outputType, el);

    expect(err).toHaveBeenCalledTimes(1);
    expect(err).toHaveBeenCalledWith(
      `Error: ${el} is not a valid HTML element`
    );
    expect(creature.outputs).not.toHaveProperty(outputType);
  });

  test('adds to outputs if el is a valid element', () => {
    const creature = new Creature('w-1');
    const outputType = 'outputType';
    const el = document.createElement('output');
    creature.setOutputEl(outputType, el);

    expect(creature.outputs).toHaveProperty(outputType);
    expect(creature.outputs[outputType]).toBe(el);
  });
});
