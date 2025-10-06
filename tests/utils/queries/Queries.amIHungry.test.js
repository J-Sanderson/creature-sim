import { motiveList, flavorList } from '../../../src/defaults';
import { creatureBuilder } from '../../helpers/creatureBuilder';
import { itemBuilder } from '../../helpers/itemBuilder';
import { queries } from '../../../src/utils/Queries';

beforeEach(() => jest.clearAllMocks());

describe('amIHungry', () => {
  test('returns false if threshold is falsy', () => {
    const getItemsByFlavor = jest.fn().mockReturnValue([]);
    const self = creatureBuilder({
      thresholdByMotive: {},
      favorites: { flavor: flavorList.chicken },
      queries: { getItemsByFlavor },
    });

    const isHungry = queries.amIHungry(self);
    expect(getItemsByFlavor).toHaveBeenCalledWith(self, flavorList.chicken);
    expect(isHungry).toBe(false);
  });

  test('returns true if no faves present and fullness is below threshold', () => {
    const getItemsByFlavor = jest.fn().mockReturnValue([]);
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.fullness]: 50 },
      motiveByMotive: { [motiveList.fullness]: 49 },
      favorites: { flavor: flavorList.chicken },
      queries: { getItemsByFlavor },
    });

    const isHungry = queries.amIHungry(self);
    expect(getItemsByFlavor).toHaveBeenCalledWith(self, flavorList.chicken);
    expect(isHungry).toBe(true);
  });

  test('returns false if no faves present and fullness is equal to threshold', () => {
    const getItemsByFlavor = jest.fn().mockReturnValue([]);
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.fullness]: 50 },
      motiveByMotive: { [motiveList.fullness]: 50 },
      favorites: { flavor: flavorList.chicken },
      queries: { getItemsByFlavor },
    });

    const isHungry = queries.amIHungry(self);
    expect(getItemsByFlavor).toHaveBeenCalledWith(self, flavorList.chicken);
    expect(isHungry).toBe(false);
  });

  test('returns false if no faves present and energy is greater than threshold', () => {
    const getItemsByFlavor = jest.fn().mockReturnValue([]);
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.fullness]: 50 },
      motiveByMotive: { [motiveList.fullness]: 51 },
      favorites: { flavor: flavorList.chicken },
      queries: { getItemsByFlavor },
    });

    const isHungry = queries.amIHungry(self);
    expect(getItemsByFlavor).toHaveBeenCalledWith(self, flavorList.chicken);
    expect(isHungry).toBe(false);
  });

  test('returns true if faves present and fullness is less than to modified threshold', () => {
    const getItemsByFlavor = jest.fn().mockReturnValue([
        itemBuilder({
            id: 'chicken-1',
            properties: { flavors: [flavorList.chicken] },
        })
    ]);
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.fullness]: 50 }, // modded threshold is 55
      motiveByMotive: { [motiveList.fullness]: 54 },
      favorites: { flavor: flavorList.chicken },
      queries: { getItemsByFlavor },
    });

    const isHungry = queries.amIHungry(self);
    expect(getItemsByFlavor).toHaveBeenCalledWith(self, flavorList.chicken);
    expect(isHungry).toBe(true);
  });

  test('returns false if faves present and fullness is equal to modified threshold', () => {
    const getItemsByFlavor = jest.fn().mockReturnValue([
        itemBuilder({
            id: 'chicken-1',
            properties: { flavors: [flavorList.chicken] },
        })
    ]);
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.fullness]: 50 }, // modded threshold is 55
      motiveByMotive: { [motiveList.fullness]: 55 },
      favorites: { flavor: flavorList.chicken },
      queries: { getItemsByFlavor },
    });

    const isHungry = queries.amIHungry(self);
    expect(getItemsByFlavor).toHaveBeenCalledWith(self, flavorList.chicken);
    expect(isHungry).toBe(false);
  });

  test('returns false if faves present and fullness is greater than modified threshold', () => {
    const getItemsByFlavor = jest.fn().mockReturnValue([
        itemBuilder({
            id: 'chicken-1',
            properties: { flavors: [flavorList.chicken] },
        })
    ]);
    const self = creatureBuilder({
      thresholdByMotive: { [motiveList.fullness]: 50 }, // modded threshold is 55
      motiveByMotive: { [motiveList.fullness]: 56 },
      favorites: { flavor: flavorList.chicken },
      queries: { getItemsByFlavor },
    });

    const isHungry = queries.amIHungry(self);
    expect(getItemsByFlavor).toHaveBeenCalledWith(self, flavorList.chicken);
    expect(isHungry).toBe(false);
  });
});