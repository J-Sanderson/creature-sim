export function itemBuilder({
  id = 'item-1',
  properties = { flavors: [], adjectives: [] },
  position = { x: 0, y: 0 },
}) {
  return {
    getGUID: () => id,
    getFlavors: () => properties.flavors,
    getAdjectives: () => properties.adjectives,
    getPosition: () => position,
  };
}
