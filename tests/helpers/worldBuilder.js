export function worldBuilder({ entities = { items: [] } }) {
  return {
    getEntities: () => entities,
    getItems: () => entities.items,
  };
}
