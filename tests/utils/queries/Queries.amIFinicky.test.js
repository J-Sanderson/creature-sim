import { personalityValueList } from '../../../src/defaults';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { queries } from '../../../src/utils/Queries';

describe('amIFinicky', () => {
  test('returns false if finickiness is falsy', () => {
    const self = creatureBuilder({});
    expect(queries.amIFinicky(self)).toBe(false);
  });

  test('returns false if maxMotive is falsy', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 0,
    });
    expect(queries.amIFinicky(self)).toBe(false);
  });

  test('returns false if random roll is greater than ratio', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 100,
    });

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.3);
    expect(queries.amIFinicky(self)).toBe(false);
    spy.mockRestore();
  });

  test('returns true if random roll is equal to ratio', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 100,
    });

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.25);
    expect(queries.amIFinicky(self)).toBe(true);
    spy.mockRestore();
  });

  test('returns true if random roll is less than ratio', () => {
    const self = creatureBuilder({
      personalityByValue: { [personalityValueList.finickiness]: 25 },
      maxMotive: 100,
    });

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.2);
    expect(queries.amIFinicky(self)).toBe(true);
    spy.mockRestore();
  });
});
