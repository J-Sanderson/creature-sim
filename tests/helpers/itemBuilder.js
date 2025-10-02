export function itemBuilder({ id = 'item-1', properties = { flavors: [], adjectives: [] } }) {
  return {
    getGUID: () => id,
    getFlavors: () => properties.flavors,
    getAdjectives: () => properties.adjectives,
  };
}
