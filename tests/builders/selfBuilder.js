export function selfBuilder({
  thresholdByMotive = {},
  motiveByMotive = {},
  personalityByValue = {},
  maxMotive = 100,
} = {}) {
  return {
    getDesireThreshold: (m) => thresholdByMotive[m],
    getMotive: (m) => motiveByMotive[m],
    getPersonalityValue: (v) => personalityByValue[v],
    getMaxMotive: () => maxMotive,
  };
}