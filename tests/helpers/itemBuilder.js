export function itemBuilder({ properties = { flavors: [], adjectives: [] } }) {
  return {
    getFlavors: () => properties.flavors,
    getAdjectives: () => properties.adjectives,
  };
}
