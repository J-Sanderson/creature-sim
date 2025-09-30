export function selfBuilder({
  thresholdByMotive = {},
  motiveByMotive = {},
  personalityByValue = {},
  maxMotive = 100,
  position = { x: 0, y: 0 },
  bounds = { x: 15, y: 15 },
} = {}) {
  return {
    getDesireThreshold: (m) => thresholdByMotive[m],
    getMotive: (m) => motiveByMotive[m],
    getPersonalityValue: (v) => personalityByValue[v],
    getMaxMotive: () => maxMotive,
    getPosition: () => position,
    getBounds: () => bounds,
  };
}
