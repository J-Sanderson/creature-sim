import { flavorList } from '../../../src/defaults';
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

describe('getItemsByFlavor', () => {
  test('returns an empty array if no valid world passed', () => {
    worldManager.getWorld.mockReturnValue(undefined);
    const id = 'w-missing';
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByFlavor(self, flavorList.chicken);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toEqual([]);
  });

  test('returns array of valid items if flavor present', () => {
    const id = 'w-1';
    const chicken = itemBuilder({
      id: 'chicken-1',
      properties: { flavors: [flavorList.chicken] },
    });
    const beef = itemBuilder({ id: 'beef-1', properties: { flavors: [flavorList.beef] } });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [chicken, beef] },
      })
    );
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByFlavor(self, flavorList.chicken);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toHaveLength(1);
    expect(items[0].getFlavors()).toContain(flavorList.chicken);
  });

  test('returns empty array if flavour not present', () => {
    const id = 'w-1';
    const beef = itemBuilder({ id:'beef-1', properties: { flavors: [flavorList.beef] } });
    const fish = itemBuilder({ id: 'fish-1', properties: { flavors: [flavorList.fish] } });
    worldManager.getWorld.mockReturnValue(
      worldBuilder({
        entities: { items: [beef, fish] },
      })
    );
    const self = creatureBuilder({ world: id });

    const items = queries.getItemsByFlavor(self, flavorList.chicken);
    expect(worldManager.getWorld).toHaveBeenCalledWith(id);
    expect(items).toEqual([]);
  });
});