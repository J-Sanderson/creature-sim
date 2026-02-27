/**
 * @jest-environment jsdom
 */

import { MetabolismManager } from '../../../src/managers/MetabolismManager';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import {
  motiveList,
  personalityValueList,
  stateList,
} from '../../../src/defaults';

describe('update', () => {
  let creatures;
  beforeEach(() => {
    jest.clearAllMocks();
    creatures = [
      creatureBuilder({
        id: 'c-1',
        personalityByValue: {
          [personalityValueList.liveliness]: 20,
          [personalityValueList.metabolism]: 30,
        },
        motiveByMotive: {
          [motiveList.hydration]: 20,
          [motiveList.fullness]: 30,
          [motiveList.energy]: 40,
        },
      }),
      creatureBuilder({
        id: 'c-2',
        personalityByValue: {
          [personalityValueList.liveliness]: 40,
          [personalityValueList.metabolism]: 50,
        },
        motiveByMotive: {
          [motiveList.hydration]: 50,
          [motiveList.fullness]: 60,
          [motiveList.energy]: 70,
        },
      }),
    ];
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'setMotive').mockImplementation(() => {});
      creature.goalManager = {
        getGoals: jest.fn(() => ({})),
        addGoal: jest.fn(),
      };
      creature.queries = {
        amIHungry: jest.fn(),
        amIThirsty: jest.fn(),
        amITired: jest.fn(),
      };
      creature.status = {
        motives: creature.getMotives(),
      };
    });
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error if no threshold for given motive', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    creatures.forEach((creature) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      metabolismManager.decayThresholds[motiveList.fullness] = undefined;

      metabolismManager.update(creature);
      expect(err).toHaveBeenCalledWith(
        `No valid decay threshold found for ${motiveList.fullness}`
      );
    });
    expect(err).toHaveBeenCalledTimes(creatures.length);
  });

  test('does not decay motive if no threshold given', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    creatures.forEach((creature) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      metabolismManager.decayThresholds[motiveList.fullness] = undefined;
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay motive if current goal supresses it', () => {
    creatures.forEach((creature) => {
      jest.spyOn(creature, 'getState').mockReturnValue({
        name: stateList.wander,
        suppressMotiveDecay: [motiveList.fullness],
      });
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay motive if at 0', () => {
    creatures.forEach((creature) => {
      creature.status.motives[motiveList.fullness] = 0;
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay if creature is sleeping and random roll is above sleepDecayChange', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0.3);
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.sleep });
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay if creature is sleeping and random roll is equal to sleepDecayChange', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0.25);
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.sleep });
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay if creature is awake and random roll is above decay threshold', () => {
    creatures.forEach((creature) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();
      const thresholds = metabolismManager.getDecayThresholds();
      jest
        .spyOn(Math, 'random')
        .mockReturnValue(thresholds[motiveList.fullness] + 0.1);
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.wander });

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay if creature is awake and random roll is equal to decay threshold', () => {
    creatures.forEach((creature) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();
      const thresholds = metabolismManager.getDecayThresholds();
      jest
        .spyOn(Math, 'random')
        .mockReturnValue(thresholds[motiveList.fullness]);
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.wander });

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay if creature has no state and random roll is above decay threshold', () => {
    creatures.forEach((creature) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();
      const thresholds = metabolismManager.getDecayThresholds();
      jest
        .spyOn(Math, 'random')
        .mockReturnValue(thresholds[motiveList.fullness] + 0.1);
      jest.spyOn(creature, 'getState').mockReturnValue('');

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('does not decay if creature has no state and random roll is equal to decay threshold', () => {
    creatures.forEach((creature) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();
      const thresholds = metabolismManager.getDecayThresholds();
      jest
        .spyOn(Math, 'random')
        .mockReturnValue(thresholds[motiveList.fullness]);
      jest.spyOn(creature, 'getState').mockReturnValue('');

      metabolismManager.update(creature);
      expect(creature.setMotive).not.toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('decays if creature is asleep and random rolls are below both thresholds', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.sleep });
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('decays if creature is awake and random roll is below decay threshold', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      jest
        .spyOn(creature, 'getState')
        .mockReturnValue({ name: stateList.wander });
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  test('decays if creature is has no state and random roll is below decay threshold', () => {
    creatures.forEach((creature) => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      jest.spyOn(creature, 'getState').mockReturnValue('');
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });
      const motives = creature.getMotives();

      metabolismManager.update(creature);
      expect(creature.setMotive).toHaveBeenCalledWith(
        motiveList.fullness,
        motives[motiveList.fullness] - 1
      );
    });
  });

  //TODO - goal setting
});
