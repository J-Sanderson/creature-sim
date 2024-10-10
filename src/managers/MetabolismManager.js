import {
  stateList,
  motiveList,
  personalityValueList,
  goalList,
} from '../defaults';

export class MetabolismManager {
  constructor(params = {}) {
    if (
      params.hasOwnProperty('personalityValues') &&
      params.hasOwnProperty('maxMotive')
    ) {
      this.decayThresholds[motiveList.fullness] =
        params.personalityValues[personalityValueList.metabolism] /
        params.maxMotive;
      this.decayThresholds[motiveList.hydration] =
        0.4 +
        params.personalityValues[personalityValueList.liveliness] /
          (params.maxMotive * 3);
      this.decayThresholds[motiveList.energy] =
        1 -
        (1 -
          params.personalityValues[personalityValueList.metabolism] /
            params.maxMotive) *
          (1 +
            params.personalityValues[personalityValueList.liveliness] /
              params.maxMotive);
      for (let threshold in this.decayThresholds) {
        this.decayThresholds[threshold] = Math.max(
          0,
          Math.min(1, this.decayThresholds[threshold])
        );
      }

      this.desireThresholds[motiveList.energy] =
        params.maxMotive * 0.2 -
        params.personalityValues[personalityValueList.liveliness] / 10;
      this.desireThresholds[motiveList.fullness] =
        params.maxMotive * 0.4 +
        params.personalityValues[personalityValueList.metabolism] / 10;
      this.desireThresholds[motiveList.hydration] =
        params.maxMotive * 0.4 +
        params.personalityValues[personalityValueList.liveliness] / 10;
    }
  }

  decayThresholds = {};
  desireThresholds = {};

  update(self) {
    const decayThresholds = this.getDecayThresholds();

    // fullness decay
    if (decayThresholds.hasOwnProperty(motiveList.fullness)) {
      if (self.status.state !== stateList.eat) {
        if (
          (self.status.state !== stateList.sleep || Math.random() < 0.25) &&
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
        !(goalList.eat in self.goalManager.getGoalList()) &&
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
      if (self.status.state !== stateList.drink) {
        if (
          (self.status.state !== stateList.sleep || Math.random() < 0.25) &&
          self.status.motives[motiveList.hydration] > 0 &&
          Math.random() < decayThresholds[motiveList.hydration]
        ) {
          self.status.motives[motiveList.hydration]--;
        }
      }
      if (
        !(goalList.drink in self.goalManager.getGoalList()) &&
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
        self.status.state !== stateList.sleep &&
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
        !(goalList.sleep in self.goalManager.getGoalList()) &&
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
