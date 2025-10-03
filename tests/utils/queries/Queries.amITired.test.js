import { motiveList } from '../../../src/defaults';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { queries } from '../../../src/utils/Queries';

describe('amITired', () => {
  test('returns false if threshold is falsy', () => {
    const self = creatureBuilder({
      thresholdByMotive: {},
      motiveByMotive: {},
    });
    expect(queries.amITired(self)).toBe(false);
  });

  test('returns true if energy is below threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.energy]: 50 },
      motiveByMotive: { [motiveList.energy]: 49 },
    });
    expect(queries.amITired(self)).toBe(true);
  });

  test('returns false if energy is equal to threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.energy]: 50 },
      motiveByMotive: { [motiveList.energy]: 50 },
    });
    expect(queries.amITired(self)).toBe(false);
  });

  test('returns false if energy is greater than threshold', () => {
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.energy]: 50 },
      motiveByMotive: { [motiveList.energy]: 51 },
    });
    expect(queries.amITired(self)).toBe(false);
  });
});
