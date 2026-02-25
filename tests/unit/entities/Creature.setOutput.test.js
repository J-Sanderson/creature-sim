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

describe('setOutput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(worldManager, 'getWorld').mockReturnValue(new MockWorld());
  });

  test('displays error and does not modify outputs if type does not exist', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const creature = new Creature('w-1');
    const outputType = 'notAnOutput';
    const outputs = creature.outputs;
    creature.setOutput(outputType, 10);

    expect(err).toHaveBeenCalledTimes(1);
    expect(err).toHaveBeenCalledWith(`Error: no output of type ${outputType}`);
    expect(creature.outputs).toBe(outputs);
  });

  test('creates goal table with correct headers and values', () => {
    const creature = new Creature('w-1');
    const outputType = 'goals';
    const goals = {
      goal1: {
        goalToken: { priority: 1, suspended: true, ticks: 5, calledBy: null },
        worldToken: { target: null },
      },
      goal2: {
        goalToken: {
          priority: 2,
          suspended: false,
          ticks: 3,
          calledBy: 'goal1',
        },
        worldToken: { target: 'target-2-id' },
      },
    };
    creature.outputs[outputType] = document.createElement('span');
    creature.setOutput(outputType, goals);

    const table = creature.outputs[outputType].querySelector('table');
    expect(table).not.toBeNull();

    const header = table.querySelector('thead');
    const rows = table.querySelectorAll('tbody tr');

    const headers = Array.from(header.querySelectorAll('th')).map(
      (th) => th.textContent
    );
    expect(headers).toEqual([
      'name',
      'priority',
      'suspended',
      'ticks',
      'calledBy',
      'target',
    ]);

    expect(rows.length).toBe(Object.keys(goals).length);

    const rowFirst = Array.from(rows[0].querySelectorAll('td')).map(
      (td) => td.textContent
    );
    expect(rowFirst).toEqual(['goal1', '1', 'true', '5', '', '']);

    const rowSecond = Array.from(rows[1].querySelectorAll('td')).map(
      (td) => td.textContent
    );
    expect(rowSecond).toEqual([
      'goal2',
      '2',
      'false',
      '3',
      'goal1',
      'target-2-id',
    ]);
  });

  test('recreates goal table on change', () => {
    const creature = new Creature('w-1');
    const outputType = 'goals';
    const goals1 = {
      goal1: {
        goalToken: { priority: 1, suspended: true, ticks: 5, calledBy: null },
        worldToken: { target: null },
      },
    };

    creature.outputs[outputType] = document.createElement('span');
    creature.setOutput(outputType, goals1);
    const table1 = creature.outputs[outputType].querySelector('table');

    const goals2 = {
      goal1: {
        goalToken: { priority: 1, suspended: true, ticks: 5, calledBy: null },
        worldToken: { target: null },
      },
      goal2: {
        goalToken: {
          priority: 2,
          suspended: false,
          ticks: 3,
          calledBy: 'goal1',
        },
        worldToken: { target: 'target-2-id' },
      },
    };

    creature.setOutput(outputType, goals2);
    const table2 = creature.outputs[outputType].querySelector('table');

    expect(table2).not.toBe(table1);
  });

  test('creates table with only headers if no goals', () => {
    const creature = new Creature('w-1');
    const el = document.createElement('span');
    creature.outputs.goals = el;

    creature.setOutput('goals', {});
    const headers = el.querySelectorAll('thead');
    const rows = el.querySelectorAll('tbody tr');
    expect(headers).toHaveLength(1);
    expect(rows).toHaveLength(0);
  });

  test('sets value for non-goal output', () => {
    const creature = new Creature('w-1');
    const outputType = 'status';
    const el = document.createElement('output');
    const status = 42;
    creature.outputs[outputType] = el;

    creature.setOutput(outputType, status);

    expect(parseInt(el.value)).toBe(status);
  });
});
