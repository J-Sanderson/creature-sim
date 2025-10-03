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

describe('getItemFromWorld', () => {
  test('returns null if no valid world passed', () => {
    worldManager.getWorld.mockReturnValue(undefined);
    const worldId = 'w-missing';
    const self = creatureBuilder({ world: worldId });

    const item = queries.getItemFromWorld(self, 'item-1');
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item).toBeNull();
  });

  test('returns item if present', () => {
    const worldId = 'w-1';
    const item1Id = 'item-1';
    const item1 = itemBuilder({ id: item1Id });
    const item2 = itemBuilder({ id: 'item-2' });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [item1, item2] },
      })
    );
    const self = creatureBuilder({ world: worldId });

    const item = queries.getItemFromWorld(self, item1Id);
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item.getGUID()).toBe(item1Id);
  });

  test('returns undefined if not present', () => {
    const worldId = 'w-1';
    const item1Id = 'item-1';
    const item2 = itemBuilder({ id: 'item-2' });
    const item3 = itemBuilder({ id: 'item-3' });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [item2, item3] },
      })
    );
    const self = creatureBuilder({ world: worldId });

    const item = queries.getItemFromWorld(self, item1Id);
    expect(worldManager.getWorld).toHaveBeenCalledWith(worldId);
    expect(item).toBeUndefined();
  });
});
