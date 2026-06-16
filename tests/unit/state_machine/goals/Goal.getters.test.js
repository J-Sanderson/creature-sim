/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';
import { creatureBuilder } from '../../../helpers/creatureBuilder';
import { goalList, emotionList, motiveList, motiveIconList, adjectiveList } from '../../../../src/defaults';

describe('getters', () => {
  let goal;
  beforeEach(() => {
    jest.clearAllMocks();
    goal = new Goal();
  });
  afterEach(() => jest.restoreAllMocks());

  describe('getName', () => {
    test('gets undefined by default', () => {
      const result = goal.getName();
      expect(result).toBeUndefined();
    });

    test('gets name when set', () => {
      const name = goalList.eat;
      goal.name = name;
      const result = goal.getName();
      expect(result).toBe(name);
    });
  });

  describe('getPriority', () => {
    test('gets 1 by default', () => {
      const result = goal.getPriority();
      expect(result).toBe(1);
    });

    test('gets value when set', () => {
      const val = 5;
      goal.setPriority(val);
      const result = goal.getPriority();
      expect(result).toBe(val);
    });
  });

  describe('getTicks', () => {
    test('gets -1 by default', () => {
      const result = goal.getTicks();
      expect(result).toBe(-1);
    });

    test('gets value when set', () => {
      const val = 5;
      goal.setTicks(val);
      const result = goal.getTicks();
      expect(result).toBe(val);
    });
  });

  describe('getDecayThreshold', () => {
    test('gets 1 by default', () => {
      const result = goal.getDecayThreshold();
      expect(result).toBe(1);
    });

    test('gets value when set', () => {
      const val = 0.5;
      goal.setDecayThreshold(val);
      const result = goal.getDecayThreshold();
      expect(result).toBe(val);
    });
  });

  describe('getCalledBy', () => {
    test('gets null by default', () => {
      const result = goal.getCalledBy();
      expect(result).toBeNull();
    });

    test('gets value when set', () => {
      const val = goalList.eat;
      goal.goalToken.calledBy = val;
      const result = goal.getCalledBy();
      expect(result).toBe(val);
    });
  });

  describe('getTarget', () => {
    test('gets null by default', () => {
      const result = goal.getTarget();
      expect(result).toBeNull();
    });

    test('gets value when set', () => {
      const val = 'target-id';
      goal.setTarget(val);
      const result = goal.getTarget();
      expect(result).toBe(val);
    });
  });

  describe('getDirection', () => {
    test('returns 0 co-ordinates by default', () => {
      const val = { x: 0, y: 0 };
      const result = goal.getDirection();
      expect(result).toEqual(val);
    });

    test('returns values when set', () => {
      const val = { x: 5, y: 6 };
      goal.setDirection(val.x, val.y);
      const result = goal.getDirection();
      expect(result).toEqual(val);
    });
  });

  describe('getEmotions', () => {
    test('returns null for all emotions by default', () => {
      const result = goal.getEmotions();
      for (let emotion in emotionList) {
        expect(result).toHaveProperty(emotionList[emotion]);
        expect(result[emotionList[emotion]]).toBeNull();
      }
    });

    test('returns values when set', () => {
      const creature = creatureBuilder({
        id: 'c-1',
      });
      const val = 50;
      goal.setEmotion(creature, { name: emotionList.happy, value: val });
      const result = goal.getEmotions();
      for (let emotion in emotionList) {
        if(emotionList[emotion] === emotionList.happy) {
          expect(result[emotionList[emotion]]).toBe(val);
        } else {
          expect(result[emotionList[emotion]]).toBeNull();
        }
      }
    });
  });

  describe('getMotives', () => {
    test('returns null for all motives by default', () => {
      const result = goal.getMotives();
      for (let motive in motiveList) {
        expect(result).toHaveProperty(motiveList[motive]);
        expect(result[motiveList[motive]]).toBeNull();
      }
    });

    test('returns values when set', () => {
      const creature = creatureBuilder({
        id: 'c-1',
      });
      const val = 50;
      goal.setMotive(creature, {name: motiveList.energy, value: val});
      const result = goal.getMotives();
      for (let motive in motiveList) {
        if(motiveList[motive] === motiveList.energy) {
          expect(result[motiveList[motive]]).toBe(val);
        } else {
          expect(result[motiveList[motive]]).toBeNull();
        }
      }
    });
  });

  describe('getMotiveIcon', () => {
    test('returns null by default', () => {
      const result = goal.getMotiveIcon();
      expect(result).toBeNull();
    });

    test('returns value when set', () => {
      const val = motiveIconList.eat;
      goal.setMotiveIcon(val);
      const result = goal.getMotiveIcon();
      expect(result).toBe(val);
    });
  });

  describe('getAdjective', () => {
    test('returns null by default', () => {
      const result = goal.getAdjective();
      expect(result).toBeNull();
    });

    test('returns value when set', () => {
      const val = adjectiveList.tasty;
      goal.setAdjective(val);
      const result = goal.getAdjective();
      expect(result).toBe(val);
    });
  });
});
