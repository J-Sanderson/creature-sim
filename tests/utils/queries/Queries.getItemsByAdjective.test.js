import { adjectiveList } from '../../../src/defaults';
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

describe('getItemsByAdjective', () => {
  test('returns an empty array if no valid world passed', () => {
    worldManager.getWorld.mockReturnValue(undefined);
    const id = 'w-missing';
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByAdjective(self, adjectiveList.chew);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toEqual([]);
  });

  test('returns array of valid items if adjective present', () => {
    const id = 'w-1';
    const chew = itemBuilder({
      id: 'chew-1',
      properties: { adjectives: [adjectiveList.chew] },
    });
    const bounce = itemBuilder({
      id: 'bounce-1',
      properties: { adjectives: [adjectiveList.bounce] },
    });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [chew, bounce] },
      })
    );
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByAdjective(self, adjectiveList.chew);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toHaveLength(1);
    expect(items[0].getAdjectives()).toContain(adjectiveList.chew);
  });

  test('returns empty array if adjective not present', () => {
    const id = 'w-1';
    const bounce = itemBuilder({
      id: 'bounce-1',
      properties: { adjectives: [adjectiveList.bounce] },
    });
    const soft = itemBuilder({
      id: 'soft-1',
      properties: { adjectives: [adjectiveList.soft] },
    });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [bounce, soft] },
      })
    );
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByAdjective(self, adjectiveList.chew);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toEqual([]);
  });
});
