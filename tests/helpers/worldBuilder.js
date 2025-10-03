export function worldBuilder({ entities = { items: [] } }) {
  const map =
    entities && entities.items.length
      ? new Map(entities.items.map((i) => [i.getGUID(), i]))
      : new Map();
  const _entities = { items: map };
  return {
    getEntities: () => _entities,
    getItems: () => _entities.items,
  };
}
