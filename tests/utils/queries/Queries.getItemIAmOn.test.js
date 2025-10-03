import { creatureBuilder } from '../../helpers/creatureBuilder';
import { worldBuilder } from '../../helpers/worldBuilder';
import { itemBuilder } from '../../helpers/itemBuilder';
import { queries } from '../../../src/utils/Queries';
import worldManager from '../../../src/managers/WorldManager';

jest.mock('../../../src/managers/WorldManager.js', () => ({
  __esModule: true,
  default: { getWorld: jest.fn() },
}));
beforeEach(() => jest.clearAllMocks());

describe('getItemIAmOn', () => {
  test('returns null if no valid world passed', () => {
    worldManager.getWorld.mockReturnValue(undefined);
    const worldId = 'w-missing';
    const self = creatureBuilder({ world: worldId });

    const item = queries.getItemIAmOn(self);
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item).toBeNull();
  });

  test('returns undefined if no items present', () => {
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [] },
      })
    );
    const worldId = 'w-1';
    const self = creatureBuilder({ world: worldId });

    const item = queries.getItemIAmOn(self);
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item).toBeUndefined();
  });

  test('returns undefined if no item has matching co-ordinates', () => {
    const worldId = 'w-1';
    const item1 = itemBuilder({ id: 'item-1', position: { x: 3, y: 3 } });
    const item2 = itemBuilder({ id: 'item-2', position: { x: 4, y: 4 } });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [item1, item2] },
      })
    );
    const self = creatureBuilder({
      world: worldId,
      position: { x: 5, y: 5 },
    });

    const item = queries.getItemIAmOn(self);
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item).toBeUndefined();
  });

  test('returns undefined if one item has one matching co-ordinate', () => {
    const worldId = 'w-1';
    const item1 = itemBuilder({ id: 'item-1', position: { x: 3, y: 3 } });
    const item2 = itemBuilder({ id: 'item-2', position: { x: 4, y: 5 } });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [item1, item2] },
      })
    );
    const self = creatureBuilder({
      world: worldId,
      position: { x: 5, y: 5 },
    });

    const item = queries.getItemIAmOn(self);
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item).toBeUndefined();
  });

  test('returns first item with two matching co-ordinates', () => {
    const worldId = 'w-1';
    const itemId = 'item-1';
    const item1 = itemBuilder({ id: itemId, position: { x: 5, y: 5 } });
    const item2 = itemBuilder({ id: 'item-2', position: { x: 5, y: 5 } });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [item1, item2] },
      })
    );
    const self = creatureBuilder({
      world: worldId,
      position: { x: 5, y: 5 },
    });

    const item = queries.getItemIAmOn(self);
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item.getGUID()).toBe(itemId);
  });
});
