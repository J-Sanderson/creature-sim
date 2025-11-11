/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World as MockWorld } from '../../../src/world/World';
import Creature from '../../../src/entities/Creature';
import worldManager from '../../../src/managers/WorldManager';
import { motiveIconList } from '../../../src/defaults';

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

describe('showMotive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  test('clears bubble when no motive specified', () => {
    const creature = new Creature('w-1');
    creature.outputs.bubble.innerHTML = '<span>motive</span>';

    creature.showMotive('');
    expect(creature.outputs.bubble.innerHTML).toBe('');
  });

  test('hides bubble when no motive specified', () => {
    const creature = new Creature('w-1');
    creature.outputs.bubble.style.display = 'block';

    creature.showMotive('');
    expect(creature.outputs.bubble.style.display).toBe('none');
  });

  test('displays correct icon when motive specified', () => {
    const creature = new Creature('w-1');
    creature.outputs.bubble.innerHTML = '';

    creature.showMotive(motiveIconList.movingToTarget);
    const span = creature.outputs.bubble.querySelector('span');
    expect(span).not.toBeNull();
    expect(
      `&#x${span.innerHTML.codePointAt(0).toString(16).toUpperCase()};`
    ).toBe(motiveIconList.movingToTarget);
  });

  test('shows bubble when motive specified', () => {
    const creature = new Creature('w-1');
    creature.outputs.bubble.style.display = 'none';

    creature.showMotive(motiveIconList.movingToTarget);
    expect(creature.outputs.bubble.style.display).toBe('block');
  });

  test('sets last passed icon', () => {
    const creature = new Creature('w-1');
    creature.showMotive(motiveIconList.movingToTarget);
    creature.showMotive(motiveIconList.chewToy);

    const span = creature.outputs.bubble.querySelector('span');
    expect(
      `&#x${span.innerHTML.codePointAt(0).toString(16).toUpperCase()};`
    ).toBe(motiveIconList.chewToy);
  });
});
