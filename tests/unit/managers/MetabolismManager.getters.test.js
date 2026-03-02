/**
 * @jest-environment jsdom
 */

import { MetabolismManager } from '../../../src/managers/MetabolismManager';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { personalityValueList, motiveList } from '../../../src/defaults';

describe('getters', () => {
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
  });
  afterEach(() => jest.restoreAllMocks());

  describe('getDecayThresholds', () => {
    test('returns object of decay thresholds', () => {
      creatures.forEach((creature) => {
        const metabolismManager = new MetabolismManager({
          personalityValues: creature.getPersonalityValues(),
          maxMotive: creature.getMaxMotive(),
        });
        const decayThresholds = metabolismManager.getDecayThresholds();

        expect(typeof decayThresholds).toBe('object');
        MetabolismManager.decayThresholdFormulas.forEach(({ motive }) => {
          expect(decayThresholds).toHaveProperty(motive);
        });
      });
    });
  });

  describe('getDesireThresholds', () => {
    test('returns object of desire thresholds', () => {
      creatures.forEach((creature) => {
        const metabolismManager = new MetabolismManager({
          personalityValues: creature.getPersonalityValues(),
          maxMotive: creature.getMaxMotive(),
        });
        const desireThresholds = metabolismManager.getDesireThresholds();

        expect(typeof desireThresholds).toBe('object');
        MetabolismManager.desireThresholdFormulas.forEach(({ motive }) => {
          expect(desireThresholds).toHaveProperty(motive);
        });
      });
    });
  });

  describe('getDesireThreshold', () => {
    test('displays error and returns undefined if threshold not present', () => {
      creatures.forEach((creature) => {
        const error = jest
          .spyOn(console, 'error')
          .mockImplementation(function () {});
        const metabolismManager = new MetabolismManager({
          personalityValues: creature.getPersonalityValues(),
          maxMotive: creature.getMaxMotive(),
        });
        const motive = 'not-a-motive';
        const desireThreshold = metabolismManager.getDesireThreshold(motive);

        expect(error).toHaveBeenCalledWith(
          `Error: no ${motive} threshold value found`
        );
        expect(desireThreshold).toBeUndefined();
      });
    });

    test('returns value if it exists', () => {
      creatures.forEach((creature) => {
        const metabolismManager = new MetabolismManager({
          personalityValues: creature.getPersonalityValues(),
          maxMotive: creature.getMaxMotive(),
        });
        const value = 50;
        metabolismManager.desireThresholds[motiveList.energy] = value;

        const desireThreshold = metabolismManager.getDesireThreshold(
          motiveList.energy
        );
        expect(desireThreshold).toBe(value);
      });
    });
  });
});
