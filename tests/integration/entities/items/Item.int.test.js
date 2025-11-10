/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

import { World } from '../../../../src/world/World';
import Entity from '../../../../src/entities/Entity';
import { Item } from '../../../../src/entities/items/Item';

describe('constructor', () => {
    test('item is an instance of Entity', () => {
        const el = document.createElement('div');
        const world = new World(el);

        const item = new Item(world.getGUID());
        expect(item).toBeInstanceOf(Entity);
    });
});