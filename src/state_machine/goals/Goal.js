import { goalTypeList, emotionList } from '../../defaults';

export default class Goal {
  static defaults = {
    goalToken: {
      priority: 1,
      suspended: false,
      ticks: -1,
      decayThreshold: 1,
      calledBy: null,
      type: goalTypeList.idle,
      // todo probably need a motive object as well
      emotions: {},
    },
    worldToken: {
      target: null,
      direction: {
        x: 0,
        y: 0,
      },
    }
  };

  constructor(params = {}) {
    this.goalToken = {};
    for (let param in Goal.defaults.goalToken) {
      this.goalToken[param] = params.hasOwnProperty(param)
        ? params[param]
        : Goal.defaults.goalToken[param];
    }

    for (let emotion in emotionList) {
      this.goalToken.emotions[emotion] = null;
    }

    this.worldToken = {};
    for (let param in Goal.defaults.worldToken) {
      this.worldToken[param] = params.hasOwnProperty(param)
        ? params[param]
        : Goal.defaults.worldToken[param];
    }
  }

  suspend() {
    this.goalToken.suspended = true;
  }

  unsuspend() {
    this.goalToken.suspended = false;
  }

  getIsSuspended() {
    return this.goalToken.suspended;
  }

  setPriority(priority) {
    this.goalToken.priority = priority;
  }

  getPriority() {
    return this.goalToken.priority;
  }

  decrementTicks() {
    const threshold = this.goalToken.decayThreshold;
    if (
      this.goalToken.ticks > 0 &&
      (threshold === 1 || Math.random() <= threshold)
    ) {
      this.goalToken.ticks--;
    }
  }

  getTicks() {
    return this.goalToken.ticks;
  }

  setTicks(val) {
    this.goalToken.ticks = val;
  }

  getDecayThreshold() {
    return this.goalToken.decayThreshold;
  }

  setDecayThreshold(val) {
    this.goalToken.decayThreshold = val;
  }

  getCalledBy() {
    return this.goalToken.calledBy;
  }

  setTarget(target) {
    this.worldToken.target = target;
  }

  getTarget() {
    return this.worldToken.target;
  }

  setDirection(x, y) {
    this.worldToken.direction = {
      x: x ? x : 0,
      y: y ? y : 0,
    };
  }

  getDirection() {
    return this.worldToken.direction;
  }

  setEmotion(params) {
    if (!params.hasOwnProperty('name') || !params.hasOwnProperty('value')) {
      console.error('Error: no valid emotion object');
      return;
    }
    if (!this.goalToken.emotions.hasOwnProperty(params.name)) {
      console.error(`Error: ${params.name} is not a valid emotion`);
      return;
    }
    this.goalToken.emotions[params.name] = params.value;
  }

  getEmotions() {
    return this.goalToken.emotions;
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
