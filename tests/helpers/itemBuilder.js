export function itemBuilder({ properties = { flavors: [] } }) {
  return {
    getFlavors: () => properties.flavors,
  };
}
