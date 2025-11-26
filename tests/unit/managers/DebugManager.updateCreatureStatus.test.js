/**
 * @jest-environment jsdom
 */

import { DebugManager } from '../../../src/managers/DebugManager';
import { worldBuilder } from '../../helpers/worldBuilder';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import {
  motiveList,
  goalList,
  planList,
  stateList,
} from '../../../src/defaults';

describe('updateCreatureStatus', () => {
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
              [motiveList.fullness]: 60,
              [motiveList.energy]: 70,
            },
          }),
          creatureBuilder({
            id: 'c-2',
            motiveByMotive: {
              [motiveList.hydration]: 50,
              [motiveList.fullness]: 60,
              [motiveList.energy]: 70,
            },
          }),
        ],
      },
    });
    debugManager.showStatusWrapper(world);
    creatures = world.getCreatures();
    creatures.forEach((creature) => {
      debugManager.showCreatureStatus(world, creature);
      jest.spyOn(creature, 'setOutput').mockImplementation(() => {});
    });
  });

  test('runs setOutput for each motive and creature', () => {
    creatures.forEach((creature) => {
      debugManager.updateCreatureStatus(creature);
      const motives = creature.getMotives();
      for (let motive in motives) {
        expect(creature.setOutput).toHaveBeenCalledWith(
          motive,
          motives[motive]
        );
      }
    });
  });

  test('runs setOutput for each creature goal name', () => {
    creatures.forEach((creature) => {
      jest
        .spyOn(creature, 'getCurrentGoalName')
        .mockReturnValue(goalList.wander);

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).toHaveBeenCalledWith(
        'currentGoalName',
        goalList.wander
      );
    });
  });

  test('runs setOutput for each creature plan if present', () => {
    creatures.forEach((creature) => {
      jest
        .spyOn(creature, 'getPlan')
        .mockReturnValue({ name: planList.wander });

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).toHaveBeenCalledWith('plan', planList.wander);
    });
  });

  test('does not run setOutput for each creature plan if no plan is set', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getPlan').mockReturnValue(null);

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).not.toHaveBeenCalledWith(
        'plan',
        expect.any(String)
      );
    });
  });

  test('does not run setOutput for each creature plan if plan has no name property', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getPlan').mockReturnValue({});

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).not.toHaveBeenCalledWith(
        'plan',
        expect.any(String)
      );
    });
  });

  test('runs setOutput for each creature state if present', () => {
    creatures.forEach((creature) => {
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.wander });

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).toHaveBeenCalledWith(
        'state',
        stateList.wander
      );
    });
  });

  test('does not run setOutput for each creature state if no state is set', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getState').mockReturnValue(null);

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).not.toHaveBeenCalledWith(
        'state',
        expect.any(String)
      );
    });
  });

  test('does not run setOutput for each creature state if state has no name property', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getState').mockReturnValue({});

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).not.toHaveBeenCalledWith(
        'state',
        expect.any(String)
      );
    });
  });

  test('runs setOutput for each creature goals', () => {
    creatures.forEach((creature) => {
      const goals = { [goalList.goalWander]: { name: goalList.goalWander } };
      jest.spyOn(creature, 'getGoals').mockReturnValue(goals);

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).toHaveBeenCalledWith('goals', goals);
    });
  });

  test('runs setOutput correct number of times', () => {
    creatures.forEach((creature) => {
      const motives = creature.getMotives();
      let calls = Object.keys(motives).length;

      jest.spyOn(creature, 'getCurrentGoalName').mockImplementation(() => {
        calls++;
        return goalList.wander;
      });

      jest.spyOn(creature, 'getPlan').mockImplementation(() => {
        calls++;
        return { name: planList.wander };
      });

      jest.spyOn(creature, 'getState').mockImplementation(() => {
        calls++;
        return { name: stateList.wander };
      });

      jest.spyOn(creature, 'getGoals').mockImplementation(() => {
        calls++;
        return { [goalList.goalWander]: { name: goalList.goalWander } };
      });

      debugManager.updateCreatureStatus(creature);
      expect(creature.setOutput).toHaveBeenCalledTimes(calls);
    });
  });
});
