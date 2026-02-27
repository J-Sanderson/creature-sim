import {
  stateList,
  motiveList,
  personalityValueList,
  goalList,
} from '../defaults';

export class MetabolismManager {
  static decayThresholdFormulas = [
    {
      motive: motiveList.fullness,
      compute: ({ maxMotive, personalityValues }) =>
        personalityValues[personalityValueList.metabolism] / maxMotive,
    },
    {
      motive: motiveList.hydration,
      compute: ({ maxMotive, personalityValues }) =>
        0.4 +
        personalityValues[personalityValueList.liveliness] / (maxMotive * 3),
    },
    {
      motive: motiveList.energy,
      compute: ({ maxMotive, personalityValues }) => {
        const metabolismRatio =
          personalityValues[personalityValueList.metabolism] / maxMotive;

        const livelinessRatio =
          personalityValues[personalityValueList.liveliness] / maxMotive;

        return 1 - (1 - metabolismRatio) * (1 + livelinessRatio);
      },
    },
  ];

  static desireThresholdFormulas = [
    {
      motive: motiveList.energy,
      personalityValue: personalityValueList.liveliness,
      multiplier: 0.2,
      divisor: 10,
    },
    {
      motive: motiveList.fullness,
      personalityValue: personalityValueList.metabolism,
      multiplier: 0.4,
      divisor: 10,
    },
    {
      motive: motiveList.hydration,
      personalityValue: personalityValueList.liveliness,
      multiplier: 0.4,
      divisor: 10,
    },
  ];

  static motiveDecayFormulas = [
    {
      motive: motiveList.fullness,
      checkGoal: 'amIHungry',
      goal: goalList.eat,
      useSetMotive: true,
    },
    {
      motive: motiveList.hydration,
      checkGoal: 'amIThirsty',
      goal: goalList.drink,
      useSetMotive: false,
    },
    {
      motive: motiveList.energy,
      checkGoal: 'amITired',
      goal: goalList.sleep,
      useSetMotive: true,
    },
  ];

  constructor(params = {}) {
    if (
      !params.hasOwnProperty('personalityValues') ||
      !params.hasOwnProperty('maxMotive')
    ) {
      console.error('Error: missing personality values or maxMotive');
      return;
    }

    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    MetabolismManager.decayThresholdFormulas.forEach(({ motive, compute }) => {
      this.decayThresholds[motive] = clamp01(compute(params));
    });

    MetabolismManager.desireThresholdFormulas.forEach(
      ({ motive, personalityValue, multiplier, divisor }) => {
        this.desireThresholds[motive] =
          params.maxMotive * multiplier -
          params.personalityValues[personalityValue] / divisor;
      }
    );
  }

  decayThresholds = {};
  desireThresholds = {};

  update(self) {
    const decayThresholds = this.getDecayThresholds();
    const state = self.getState();

    MetabolismManager.motiveDecayFormulas.forEach(
      ({ motive, checkGoal, goal, useSetMotive }) => {
        const threshold = decayThresholds[motive];
        if (threshold === undefined) return;

        const suppressed = state?.suppressMotiveDecay?.includes(motive);
        const sleepDecayChance = 0.25;
        const canDecay =
          !suppressed &&
          self.status.motives[motive] > 0 &&
          (state?.name !== stateList.sleep || Math.random() < sleepDecayChance) &&
          Math.random() < threshold;

        if (canDecay) {
          if (useSetMotive) {
            self.setMotive(motive, self.status.motives[motive] - 1);
          } else {
            self.status.motives[motive]--;
          }
        }

        const goals = self.goalManager.getGoals();
        const needsGoal = !(goal in goals) && self.queries[checkGoal](self);

        if (needsGoal) {
          self.goalManager.addGoal(
            self,
            goal,
            {
              tickModifiers: {
                personality: self.getPersonalityValues(),
                maxMotive: self.getMaxMotive(),
              },
            },
            false
          );
        }
      }
    );
  }

  getDecayThresholds() {
    return this.decayThresholds;
  }

  getDesireThresholds() {
    return this.desireThresholds;
  }

  getDesireThreshold(desire) {
    if (!(desire in this.desireThresholds)) {
      console.error(`Error: no ${desire} threshold value found`);
      return;
    }
    return this.desireThresholds[desire];
  }
}
