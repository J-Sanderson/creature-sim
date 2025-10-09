export function creatureBuilder({
  thresholdByMotive = {},
  motiveByMotive = {},
  personalityByValue = {},
  maxMotive = 100,
  position = { x: 0, y: 0 },
  bounds = { x: 15, y: 15 },
  world = 'w-1',
  favorites = { flavor: '' },
  queries = {},
} = {}) {
  return {
    getDesireThreshold: (m) => thresholdByMotive[m],
    getMotive: (m) => motiveByMotive[m],
    getPersonalityValue: (v) => personalityByValue[v],
    getMaxMotive: () => maxMotive,
    getPosition: () => position,
    getBounds: () => bounds,
    getWorld: () => world,
    getFavorites: () => favorites,
    update: () => {},
    queries,
  };
}
