import { goalTypeList } from '../../defaults';

export default class Goal {
  static defaults = {
    priority: 1,
    suspended: false,
    ticks: -1,
    decayThreshold: 1,
    target: null,
    calledBy: null,
    type: goalTypeList.idle,
  };

  constructor(params = {}) {
    for (let param in Goal.defaults) {
      this[param] = params.hasOwnProperty(param)
        ? params[param]
        : Goal.defaults[param];
    }
  }

  suspend() {
    this.suspended = true;
  }

  unsuspend() {
    this.suspended = false;
  }

  getIsSuspended() {
    return this.suspended;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  getPriority() {
    return this.priority;
  }

  decrementTicks() {
    const threshold = this.decayThreshold;
    if (this.ticks > 0 && (threshold === 1 || Math.random() <= threshold)) {
      this.ticks--;
    }
  }

  getTicks() {
    return this.ticks;
  }

  setTicks(val) {
    this.ticks = val;
  }

  getDecayThreshold() {
    return this.decayThreshold;
  }

  setDecayThreshold(val) {
    this.decayThreshold = val;
  }

  setTarget(target) {
    this.target = target;
  }

  getTarget() {
    return this.target;
  }

  getCalledBy() {
    return this.calledBy;
  }

  calculatePersonalityModifier(self, personalityType, positive = true) {
    const personalityValues = self.getPersonalityValues();
    const personalityValue = personalityValues[personalityType];
    if (typeof personalityValue !== 'number') {
      console.error(`Error: no personality value found for ${personalityType}`);
      return 0;
    }
    const maxMotive = self.getMaxMotive();
    const scaler = 3;

    let factor = Math.min(1, personalityValue / maxMotive);
    if (!positive) {
      factor = 1 - factor;
    }

    const modifier = Math.floor(scaler * factor);
    return modifier;
  }

  calculateEmotionModifier(self, emotionType, positive = true) {
    const emotions = self.getEmotions();
    const emotion = emotions[emotionType];
    if (typeof emotion !== 'number') {
      console.error(`Error: no personality value found for ${emotionType}`);
      return 0;
    }
    const maxMotive = self.getMaxMotive();
    const scaler = 3;

    let factor = Math.min(1, emotion / maxMotive);
    if (!positive) {
      factor = 1 - factor;
    }

    const modifier = Math.floor(scaler * factor);
    return modifier;
  }

  calculateModifiedTicks(personalityVal, maxMotive, ticks, positive = true) {
    if (typeof personalityVal !== 'number' || !maxMotive) {
      console.error(
        `Error: could not find personality value or max motive value`
      );
      return 0;
    }
    const scaler = 0.5;
    const baseline = 1;

    let factor = Math.min(1, personalityVal / maxMotive);
    if (!positive) {
      factor = 1 - factor;
    }

    const adjustedTicks = Math.floor(ticks * (baseline + scaler * factor));
    return adjustedTicks;
  }

  calculateModifiedDecayThreshold(
    personalityVal,
    maxMotive,
    threshold,
    positive = true
  ) {
    const max = 1;
    const min = 0.4;
    if (!personalityVal || !maxMotive) {
      console.error(
        `Error: could not find personality value or max motive value`
      );
      return max;
    }

    let factor = personalityVal / maxMotive;
    if (!positive) {
      factor = 1 - factor;
    }

    factor = threshold - factor;

    factor = Math.min(max, factor);
    factor = Math.max(min, factor);

    return factor;
  }
}
