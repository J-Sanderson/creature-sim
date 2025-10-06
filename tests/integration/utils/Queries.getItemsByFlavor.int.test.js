/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from "../../../src/world/World";
import Chicken from '../../../src/entities/items/Chicken';
import Steak from '../../../src/entities/items/Steak';
import { queries } from '../../../src/utils/Queries';
import { creatureBuilder } from '../../helpers/creatureBuilder';

describe('getItemsByFlavor', () => {
    test('integrates WM→World→(item of requested flavor)', () => {
        const flavor = Chicken.flavors.join();
        const world = new World(document.createElement('div'));
        const button1 = document.createElement('button');
        button1.dataset.flavors = flavor;
        const button2 = document.createElement('button');
        button2.dataset.flavors = Steak.flavors.join();

        world.toggleItem(button1, Chicken);
        world.toggleItem(button2, Steak);

        const self = creatureBuilder({ world: world.getGUID() });

        const items = queries.getItemsByFlavor(self, flavor);
        expect(items).toHaveLength(1);
        expect(items[0]).toBeInstanceOf(Chicken);
        expect(items[0]).not.toBeInstanceOf(Steak);
    });
});