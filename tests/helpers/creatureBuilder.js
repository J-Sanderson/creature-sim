export function creatureBuilder({
  id = 'c-1',
  thresholdByMotive = {},
  motiveByMotive = {},
  personalityByValue = {},
  emotionByValue = {},
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
    getStatus: () => {
      return {
        motives: motiveByMotive,
        emotions: emotionByValue,
      };
    },
    getMotives: () => motiveByMotive,
    getMotive: (m) => motiveByMotive[m],
    getPersonalityValues: () => personalityByValue,
    getPersonalityValue: (v) => personalityByValue[v],
    getEmotions: () => emotionByValue,
    getMaxMotive: () => maxMotive,
    getPosition: () => position,
    getBounds: () => bounds,
    getWorld: () => world,
    getFavorites: () => favorites,
    update: () => {},
    setOutput: () => jest.fn(),
    setOutputEl: () => jest.fn(),
    setMotive: () => jest.fn(),
    emotionManager: {
      setEmotion: () => jest.fn(),
    },
    queries,
  };
}
