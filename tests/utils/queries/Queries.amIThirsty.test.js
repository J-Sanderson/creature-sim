import { motiveList } from '../../../src/defaults';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { queries } from '../../../src/utils/Queries';

describe('amIThirsty', () => {
  test('returns false if threshold is falsy', () => {
    const self = creatureBuilder({});
    expect(queries.amIThirsty(self)).toBe(false);
  });

  test('returns true if hydration is below threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.hydration]: 50 },
      motiveByMotive: { [motiveList.hydration]: 49 },
    });
    expect(queries.amIThirsty(self)).toBe(true);
  });

  test('returns false if hydration is equal to threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.hydration]: 50 },
      motiveByMotive: { [motiveList.hydration]: 50 },
    });
    expect(queries.amIThirsty(self)).toBe(false);
  });

  test('returns false if hydration is greater than threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.hydration]: 50 },
      motiveByMotive: { [motiveList.hydration]: 51 },
    });
    expect(queries.amIThirsty(self)).toBe(false);
  });
});
