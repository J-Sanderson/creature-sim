/**
 * @jest-environment jsdom
 */

import { DebugManager } from '../../../src/managers/DebugManager';
import { worldBuilder } from '../../helpers/worldBuilder';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { motiveList } from '../../../src/defaults';

describe('showCreatureStatus', () => {
  let debugManager;
  let world;
  let creatures;

  beforeEach(() => {
    debugManager = new DebugManager();
    world = worldBuilder({
      entities: {
        items: [],
        creatures: [
          creatureBuilder({
            id: 'c-1',
            motiveByMotive: {
              [motiveList.hydration]: 50,
              [motiveList.fullness]: 50,
              [motiveList.energy]: 50,
            },
          }),
          creatureBuilder({
            id: 'c-2',
            motiveByMotive: {
              [motiveList.hydration]: 50,
              [motiveList.fullness]: 50,
              [motiveList.energy]: 50,
            },
          }),
        ],
      },
    });
    debugManager.showStatusWrapper(world);
    creatures = world.getCreatures();
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'setOutputEl').mockImplementation(() => {});
      debugManager.showCreatureStatus(world, creature);
    });
  });

  describe('main status element', () => {
    test('appends div element with status class to status wrapper for each creature', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      expect(Array.from(statuses).length).toBe(creatures.size);
      statuses.forEach((status) => {
        expect(status).toBeInstanceOf(HTMLDivElement);
        expect(status.parentElement).toBe(world.elements.statusWrapper);
      });
    });

    test('status element contains creature ID', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach((creature) => {
        expect(statuses[i].innerHTML).toEqual(
          expect.stringContaining(`Creature: ${creature.getGUID()}`)
        );
        i++;
      });
    });
  });

  describe('status item elements', () => {
    test('appends status item spans to status wrapper', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach(() => {
        const status = statuses[i];
        const statusItems = status.querySelectorAll(
          '.status-item.status-item-motive'
        );
        statusItems.forEach(statusItem => {
          expect(statusItem).toBeInstanceOf(HTMLSpanElement);
          expect(statusItem.parentElement).toBe(status);
        });
        i++;
      });
    });

    test('each status item contains an initially empty output', () => {
      const statusItems = world.elements.statusWrapper.querySelectorAll(
        '.status .status-item'
      );
      statusItems.forEach((statusItem) => {
        const output = statusItem.querySelector('output');
        expect(output).toBeInstanceOf(HTMLOutputElement);
        expect(output.val).toBeUndefined();
      });
    });

    test('each status item is preceeded by a break element', () => {
      const statusItems = world.elements.statusWrapper.querySelectorAll(
        '.status .status-item'
      );
      statusItems.forEach((statusItem) => {
        const breakEl = statusItem.previousSibling;
        expect(breakEl).toBeInstanceOf(HTMLBRElement);
      });
    });
  });

  describe('motive elements', () => {
    test('status element contains status-item/status-item-motive span for each creature and motive', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach((creature) => {
        const status = statuses[i];
        const statusItems = status.querySelectorAll(
          '.status-item.status-item-motive'
        );
        const motives = creature.getMotives();
        expect(Array.from(statusItems).length).toBe(
          Object.keys(motives).length
        );

        let j = 0;
        for (let motive in motives) {
          expect(statusItems[j].innerHTML).toEqual(
            expect.stringContaining(motive)
          );
          j++;
        }
        i++;
      });
    });

    test('calls creature.setOutputEl for each creature and motive with motive name and output element', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach((creature) => {
        const status = statuses[i];
        const statusItems = status.querySelectorAll(
          '.status-item.status-item-motive'
        );
        const motives = creature.getMotives();

        let j = 0;
        for (let motive in motives) {
          const output = statusItems[j].querySelector('output');
          expect(creature.setOutputEl).toHaveBeenCalledWith(motive, output);
          j++;
        }
        i++;
      });
    });
  });

  describe('goal elements', () => {
    test('status element contains status-item/status-item-goal span for each creature and static goal output', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach(() => {
        const status = statuses[i];
        const statusItems = status.querySelectorAll(
          '.status-item.status-item-goal'
        );
        expect(Array.from(statusItems).length).toBe(
          DebugManager.goalOutputs.length
        );

        DebugManager.goalOutputs.forEach((goalOutput, j) => {
          expect(statusItems[j].innerHTML).toEqual(
            expect.stringContaining(goalOutput)
          );
        });
      });
    });

    test('calls creature.setOutputEl for each creature and static goal output with goal output name and output element', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach((creature) => {
        const status = statuses[i];
        const statusItems = status.querySelectorAll(
          '.status-item.status-item-goal'
        );

        DebugManager.goalOutputs.forEach((goalOutput, j) => {
          const output = statusItems[j].querySelector('output');
          expect(creature.setOutputEl).toHaveBeenCalledWith(goalOutput, output);
        });

        i++;
      });
    });
  });

  describe('status elements', () => {
    test('status element contains status-item/status-item-status span for each creature and static status output', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach(() => {
        const status = statuses[i];
        const statusItems = status.querySelectorAll(
          '.status-item.status-item-status'
        );
        expect(Array.from(statusItems).length).toBe(
          DebugManager.statusOutputs.length
        );

        DebugManager.statusOutputs.forEach((statusOutput, j) => {
          expect(statusItems[j].innerHTML).toEqual(
            expect.stringContaining(statusOutput)
          );
        });
      });
    });

    test('calls creature.setOutputEl for each creature and static status output with status output name and output element', () => {
      const statuses = world.elements.statusWrapper.querySelectorAll('.status');
      let i = 0;
      creatures.forEach((creature) => {
        const status = statuses[i];
        const statusItems = status.querySelectorAll(
          '.status-item.status-item-status'
        );

        DebugManager.statusOutputs.forEach((statusOutput, j) => {
          const output = statusItems[j].querySelector('output');
          expect(creature.setOutputEl).toHaveBeenCalledWith(statusOutput, output);
        });

        i++;
      });
    });
  });
});
