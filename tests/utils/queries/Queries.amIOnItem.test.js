import { creatureBuilder } from '../../helpers/creatureBuilder';
import { queries } from '../../../src/utils/Queries';
import { itemBuilder } from '../../helpers/itemBuilder';

beforeEach(() => jest.clearAllMocks());

describe('amIOnItem', () => {
  test('returns null if no item id passed', () => {
    const getItemFromWorld = jest.fn();
    const self = creatureBuilder({});

    const onItem = queries.amIOnItem(self);
    expect(onItem).toBe(false);
    expect(getItemFromWorld).not.toHaveBeenCalled();
  });

  test('returns false if item does not exist', () => {
    const getItemFromWorld = jest.fn().mockReturnValue(null);
    const id = 'i-missing';
    const self = creatureBuilder({ queries: { getItemFromWorld } });

    const onItem = queries.amIOnItem(self, id);
    expect(onItem).toBe(false);
    expect(getItemFromWorld).toHaveBeenCalledWith(self, id);
  });

  test('returns false if neither co-ordinate matches', () => {
    const id = 'i-not-reached';
    const item = itemBuilder({
      id,
      position: { x: 4, y: 4 },
    });
    const getItemFromWorld = jest.fn().mockReturnValue(item);
    const self = creatureBuilder({
      queries: { getItemFromWorld },
      position: { x: 5, y: 5 },
    });

    const onItem = queries.amIOnItem(self, id);
    expect(onItem).toBe(false);
    expect(getItemFromWorld).toHaveBeenCalledWith(self, id);
  });

  test('returns false if only one co-ordinate matches', () => {
    const id = 'i-not-reached';
    const item = itemBuilder({
      id,
      position: { x: 5, y: 4 },
    });
    const getItemFromWorld = jest.fn().mockReturnValue(item);
    const self = creatureBuilder({
      queries: { getItemFromWorld },
      position: { x: 5, y: 5 },
    });

    const onItem = queries.amIOnItem(self, id);
    expect(onItem).toBe(false);
    expect(getItemFromWorld).toHaveBeenCalledWith(self, id);
  });

  test('returns true if co-ordinates match', () => {
    const id = 'item-reached';
    const item = itemBuilder({
      id,
      position: { x: 5, y: 5 },
    });
    const getItemFromWorld = jest.fn().mockReturnValue(item);
    const self = creatureBuilder({
      queries: { getItemFromWorld },
      position: { x: 5, y: 5 },
    });

    const onItem = queries.amIOnItem(self, id);
    expect(onItem).toBe(true);
    expect(getItemFromWorld).toHaveBeenCalledWith(self, id);
  });
});
