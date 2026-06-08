/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';
import { creatureBuilder } from '../../../helpers/creatureBuilder';
import { emotionList } from '../../../../src/defaults';

describe('calculateEmotionModifier', () => {
  let creature, goal;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = creatureBuilder({
      id: 'c-1',
    });
    goal = new Goal();
  });
  afterEach(() => jest.restoreAllMocks());

  test('returns creature.getEmotions', () => {
    let getEmotions = jest.spyOn(creature, 'getEmotions').mockReturnValue({
      [emotionList.happy]: 50,
    });
    goal.calculateEmotionModifier(creature, emotionList.happy);
    expect(getEmotions).toHaveBeenCalledTimes(1);
  });

  test('displays error and returns 0 if emotion value does not exist', () => {
    jest.spyOn(creature, 'getEmotions').mockReturnValue({
      [emotionList.happy]: 50,
    });
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const val = 'not-a-value';
    const modifier = goal.calculateEmotionModifier(creature, val);
    expect(err).toHaveBeenCalledWith(
      `Error: no personality value found for ${val}`
    );
    expect(modifier).toBe(0);
  });

  test('display error and returns 0 if emotion value is not a number', () => {
    jest.spyOn(creature, 'getEmotions').mockReturnValue({
      [emotionList.happy]: '50',
    });
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const modifier = goal.calculateEmotionModifier(creature, emotionList.happy);
    expect(err).toHaveBeenCalledWith(
      `Error: no personality value found for ${emotionList.happy}`
    );
    expect(modifier).toBe(0);
  });

  test('returns correct modifier for given emotion', () => {
    jest.spyOn(creature, 'getEmotions').mockReturnValue({
      [emotionList.sad]: 10,
      [emotionList.happy]: 50,
      [emotionList.angry]: 90,
    });
    const modifierSad = goal.calculateEmotionModifier(
      creature,
      emotionList.sad
    );
    const modifierHappy = goal.calculateEmotionModifier(
      creature,
      emotionList.happy
    );
    const modifierAngry = goal.calculateEmotionModifier(
      creature,
      emotionList.angry
    );
    expect(modifierSad).toBe(0);
    expect(modifierHappy).toBe(1);
    expect(modifierAngry).toBe(2);
  });

  test('returns correct modifier for given emotion if positive=false', () => {
    jest.spyOn(creature, 'getEmotions').mockReturnValue({
      [emotionList.sad]: 10,
      [emotionList.happy]: 50,
      [emotionList.angry]: 90,
    });
    const modifierSad = goal.calculateEmotionModifier(
      creature,
      emotionList.sad,
      false
    );
    const modifierHappy = goal.calculateEmotionModifier(
      creature,
      emotionList.happy,
      false
    );
    const modifierAngry = goal.calculateEmotionModifier(
      creature,
      emotionList.angry,
      false
    );
    expect(modifierSad).toBe(2);
    expect(modifierHappy).toBe(1);
    expect(modifierAngry).toBe(0);
  });
});
