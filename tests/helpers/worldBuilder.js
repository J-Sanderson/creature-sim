export function worldBuilder({ entities = { items: [], creatures: [] } }) {
  const iMap =
    entities && entities.items.length
      ? new Map(entities.items.map((i) => [i.getGUID(), i]))
      : new Map();
  const cMap =
    entities && entities.creatures.length
      ? new Map(entities.creatures.map((c) => [c.getGUID(), c]))
      : new Map();
  const _entities = { items: iMap, creatures: cMap };
  return {
    getEntities: () => _entities,
    getItems: () => _entities.items,
    elements: {
      root: document.createElement('div'),
    },
  };
}
