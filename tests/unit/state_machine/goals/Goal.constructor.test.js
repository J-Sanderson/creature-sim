/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';
import { motiveList, emotionList } from '../../../../src/defaults';

describe('constructor', () => {
  let goal;
  beforeEach(() => {
    jest.clearAllMocks();
    goal = new Goal({});
  });
  afterEach(() => jest.restoreAllMocks());

  test('populates goalToken with defaults', () => {
    for (let param in Goal.defaults.goalToken) {
      if (param !== 'motives' && param !== 'emotions') {
        expect(goal.goalToken[param]).toBe(Goal.defaults.goalToken[param]);
      }
    }
  });

  test('populates goalToken.motives with null values for all motives', () => {
    for (let motive in motiveList) {
      expect(goal.goalToken.motives).toHaveProperty(motive);
      expect(goal.goalToken.motives[motive]).toBeNull();
    }
    expect(Object.keys(goal.goalToken.motives)).toHaveLength(
      Object.keys(motiveList).length
    );
  });

  test('populates goalToken.emotions with null values for all emotions', () => {
    for (let emotion in emotionList) {
      expect(goal.goalToken.emotions).toHaveProperty(emotion);
      expect(goal.goalToken.emotions[emotion]).toBeNull();
    }
    expect(Object.keys(goal.goalToken.emotions)).toHaveLength(
      Object.keys(emotionList).length
    );
  });

  test('populates worldToken with defaults', () => {
    for (let param in Goal.defaults.worldToken) {
      expect(goal.worldToken[param]).toBe(Goal.defaults.worldToken[param]);
    }
  });
});
