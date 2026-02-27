/**
 * @jest-environment jsdom
 */

import { MetabolismManager } from '../../../src/managers/MetabolismManager';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { motiveList, personalityValueList } from '../../../src/defaults';

describe('constructor', () => {
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
      }),
      creatureBuilder({
        id: 'c-2',
        personalityByValue: {
          [personalityValueList.liveliness]: 40,
          [personalityValueList.metabolism]: 50,
        },
      }),
    ];
  });
  afterEach(() => jest.restoreAllMocks());

  test('displays error if personality values not passed', () => {
    creatures.forEach((creature) => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      new MetabolismManager({
        maxMotive: creature.getMaxMotive(),
      });

      expect(err).toHaveBeenCalledWith(
        'Error: missing personality values or maxMotive'
      );
    });
  });

  test('does not populate thresholds if personality values not passed', () => {
    creatures.forEach((creature) => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const metabolismManager = new MetabolismManager({
        maxMotive: creature.getMaxMotive(),
      });

      expect(metabolismManager.decayThresholds).toEqual({});
      expect(metabolismManager.desireThresholds).toEqual({});
    });
  });

  test('displays error if maxMotive not passed', () => {
    creatures.forEach((creature) => {
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
      });

      expect(err).toHaveBeenCalledWith(
        'Error: missing personality values or maxMotive'
      );
    });
  });

  test('does not populate thresholds if maxMotive not passed', () => {
    creatures.forEach((creature) => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const metabolismManager = new MetabolismManager({
        maxMotive: creature.getMaxMotive(),
      });

      expect(metabolismManager.decayThresholds).toEqual({});
      expect(metabolismManager.desireThresholds).toEqual({});
    });
  });

  test('correctly calculates decay thresholds', () => {
    const expectedValues = [
      {
        fullness: 0.3,
        hydration: 0.4666666667,
        energy: 0.16,
      },
      {
        fullness: 0.5,
        hydration: 0.5333333,
        energy: 0.3,
      },
    ];
    creatures.forEach((creature, i) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });

      [motiveList.fullness, motiveList.hydration, motiveList.energy].forEach(
        (motive) => {
          expect(metabolismManager.decayThresholds[motive]).toBeCloseTo(
            expectedValues[i][motive]
          );
        }
      );
    });
  });

  test('decay thresholds are clamped between 0 and 1', () => {
    creatures.forEach((creature) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });

      for (let motive in metabolismManager.decayThresholds) {
        expect(
          metabolismManager.decayThresholds[motive]
        ).toBeGreaterThanOrEqual(0);
        expect(metabolismManager.decayThresholds[motive]).toBeLessThanOrEqual(
          1
        );
      }
    });
  });

  test('correctly calculates desire thresholds', () => {
    const expectedValues = [
      { energy: 18, fullness: 37, hydration: 38 },
      { energy: 16, fullness: 35, hydration: 36 },
    ];
    creatures.forEach((creature, i) => {
      const metabolismManager = new MetabolismManager({
        personalityValues: creature.getPersonalityValues(),
        maxMotive: creature.getMaxMotive(),
      });

      [motiveList.fullness, motiveList.hydration, motiveList.energy].forEach(
        (motive) => {
          expect(metabolismManager.desireThresholds[motive]).toBeCloseTo(
            expectedValues[i][motive]
          );
        }
      );
    });
  });
});
