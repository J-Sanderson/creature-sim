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

    // fullness decay
    if (decayThresholds.hasOwnProperty(motiveList.fullness)) {
      if (state && !state.suppressMotiveDecay.includes(motiveList.fullness)) {
        if (
          ((state && state.name !== stateList.sleep) || Math.random() < 0.25) &&
          self.status.motives[motiveList.fullness] > 0
        ) {
          if (Math.random() < decayThresholds[motiveList.fullness]) {
            self.setMotive(
              motiveList.fullness,
              self.status.motives[motiveList.fullness] - 1
            );
          }
        }
      }
      if (
        !(goalList.eat in self.goalManager.getGoals()) &&
        self.queries.amIHungry(self)
      ) {
        self.goalManager.addGoal(
          self,
          goalList.eat,
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

    // hydration decay
    if (decayThresholds.hasOwnProperty(motiveList.hydration)) {
      if (state && !state.suppressMotiveDecay.includes(motiveList.hydration)) {
        if (
          ((state && state.name !== stateList.sleep) || Math.random() < 0.25) &&
          self.status.motives[motiveList.hydration] > 0 &&
          Math.random() < decayThresholds[motiveList.hydration]
        ) {
          self.status.motives[motiveList.hydration]--;
        }
      }
      if (
        !(goalList.drink in self.goalManager.getGoals()) &&
        self.queries.amIThirsty(self)
      ) {
        self.goalManager.addGoal(
          self,
          goalList.drink,
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

    // energy decay
    if (decayThresholds.hasOwnProperty(motiveList.energy)) {
      if (
        state &&
        !state.suppressMotiveDecay.includes(motiveList.energy) &&
        self.status.motives[motiveList.energy] > 0
      ) {
        if (Math.random() < decayThresholds[motiveList.energy]) {
          self.setMotive(
            motiveList.energy,
            self.status.motives[motiveList.energy] - 1
          );
        }
      }
      if (
        !(goalList.sleep in self.goalManager.getGoals()) &&
        self.queries.amITired(self)
      ) {
        self.goalManager.addGoal(
          self,
          goalList.sleep,
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
