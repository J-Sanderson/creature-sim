export function creatureBuilder({
  id = 'c-1',
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
    getGUID: () => id,
    getDesireThreshold: (m) => thresholdByMotive[m],
    getMotives: () => motiveByMotive,
    getMotive: (m) => motiveByMotive[m],
    getPersonalityValue: (v) => personalityByValue[v],
    getMaxMotive: () => maxMotive,
    getPosition: () => position,
    getBounds: () => bounds,
    getWorld: () => world,
    getFavorites: () => favorites,
    update: () => {},
    setOutputEl: () => jest.fn(),
    queries,
  };
}
