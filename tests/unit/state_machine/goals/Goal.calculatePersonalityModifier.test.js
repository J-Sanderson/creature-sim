/**
 * @jest-environment jsdom
 */

import Goal from '../../../../src/state_machine/goals/Goal';
import { creatureBuilder } from '../../../helpers/creatureBuilder';
import { personalityValueList } from '../../../../src/defaults';

describe('calculatePersonalityModifier', () => {
  let creature, goal;
  beforeEach(() => {
    jest.clearAllMocks();
    creature = creatureBuilder({
      id: 'c-1',
    });
    goal = new Goal();
  });
  afterEach(() => jest.restoreAllMocks());

  test('runs creature.getPersonalityValues', () => {
    let getPersonalityValues = jest
      .spyOn(creature, 'getPersonalityValues')
      .mockReturnValue({ [personalityValueList.playfulness]: 50 });
    goal.calculatePersonalityModifier(
      creature,
      personalityValueList.playfulness
    );
    expect(getPersonalityValues).toHaveBeenCalledTimes(1);
  });

  test('displays error and returns 0 if personality value does not exist', () => {
    jest
      .spyOn(creature, 'getPersonalityValues')
      .mockReturnValue({ [personalityValueList.playfulness]: 50 });
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const val = 'not-a-value';
    const modifier = goal.calculatePersonalityModifier(creature, val);
    expect(err).toHaveBeenCalledWith(
      `Error: no personality value found for ${val}`
    );
    expect(modifier).toBe(0);
  });

  test('display error and returns 0 if personality value is not a number', () => {
    jest
      .spyOn(creature, 'getPersonalityValues')
      .mockReturnValue({ [personalityValueList.playfulness]: '50' });
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const modifier = goal.calculatePersonalityModifier(
      creature,
      personalityValueList.playfulness
    );
    expect(err).toHaveBeenCalledWith(
      `Error: no personality value found for ${personalityValueList.playfulness}`
    );
    expect(modifier).toBe(0);
  });

  test('returns correct modifier for given personality', () => {
    jest.spyOn(creature, 'getPersonalityValues').mockReturnValue({
      [personalityValueList.patience]: 10,
      [personalityValueList.playfulness]: 50,
      [personalityValueList.independence]: 90,
    });
    const modifierPatience = goal.calculatePersonalityModifier(
      creature,
      personalityValueList.patience
    );
    const modifierPlayfulness = goal.calculatePersonalityModifier(
      creature,
      personalityValueList.playfulness
    );
    const modifierIndependence = goal.calculatePersonalityModifier(
      creature,
      personalityValueList.independence
    );
    expect(modifierPatience).toBe(0);
    expect(modifierPlayfulness).toBe(1);
    expect(modifierIndependence).toBe(2);
  });

  test('returns correct modifier for given personality if positive=false', () => {
    jest.spyOn(creature, 'getPersonalityValues').mockReturnValue({
      [personalityValueList.patience]: 10,
      [personalityValueList.playfulness]: 50,
      [personalityValueList.independence]: 90,
    });
    const modifierPatience = goal.calculatePersonalityModifier(
      creature,
      personalityValueList.patience,
      false
    );
    const modifierPlayfulness = goal.calculatePersonalityModifier(
      creature,
      personalityValueList.playfulness,
      false
    );
    const modifierIndependence = goal.calculatePersonalityModifier(
      creature,
      personalityValueList.independence,
      false
    );
    expect(modifierPatience).toBe(2);
    expect(modifierPlayfulness).toBe(1);
    expect(modifierIndependence).toBe(0);
  });
});
