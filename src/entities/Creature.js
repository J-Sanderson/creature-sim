import Entity from './Entity';
import { GoalManager } from '../managers/GoalManager';
import { MetabolismManager } from '../managers/MetabolismManager';
import { EmotionManager } from '../managers/EmotionManager';
import { utilities } from '../utils/Utilities';
import { queries } from '../utils/Queries';
import {
  motiveList,
  flavorList,
  colorList,
  adjectiveList,
  personalityValueList,
  emotionList,
  goalList,
} from '../defaults';
import states from '../state_machine/states';
import plans from '../state_machine/plans';
import goals from '../state_machine/goals';

export default class Creature extends Entity {
  static validMotives = [
    motiveList.fullness,
    motiveList.hydration,
    motiveList.energy,
  ];

  static validFaves = {
    flavors: [flavorList.chicken, flavorList.beef, flavorList.fish],
    colors: [
      colorList.white,
      colorList.green,
      colorList.brown,
      colorList.red,
      colorList.orange,
      colorList.blue,
    ],
  };

  static validEmotions = [emotionList.happy, emotionList.sad];

  static adjectives = [adjectiveList.animate];

  constructor(world, params = {}) {
    super(world, params);

    let icon = this.outputs.icon;
    icon.classList.add('creature');
    let bubble = document.createElement('div');
    bubble.classList.add('bubble');
    icon.appendChild(bubble);
    this.outputs.bubble = bubble;

    this.order = 2;

    this.properties.adjectives.push(...Creature.adjectives);

    Creature.validMotives.forEach((motive) => {
      this.status.motives[motive] = utilities.rand(this.maxMotive);
    });

    this.status.emotions = {};
    Creature.validEmotions.forEach((emotion) => {
      this.status.emotions[emotion] = 0;
    });

    this.personality = {
      values: {},
      favorites: {
        flavor: '',
      },
    };

    for (let value in personalityValueList) {
      this.personality.values[personalityValueList[value]] = utilities.rand(
        this.maxMotive
      );
    }
    let personalityValues = this.getPersonalityValues();

    this.personality.favorites.flavor =
      flavorList[
        Creature.validFaves.flavors[
          utilities.rand(Creature.validFaves.flavors.length)
        ]
      ];
    this.personality.favorites.color =
      colorList[
        Creature.validFaves.colors[
          utilities.rand(Creature.validFaves.colors.length)
        ]
      ];

    this.states = states;
    this.plans = plans;
    this.goals = goals;
    this.queries = queries;

    this.outputs.motives = {};

    this.icon = '&#x1F415;';
    this.setIcon();
    this.setEventHandlers();

    this.goalManager = new GoalManager();
    this.metabolismManager = new MetabolismManager({
      personalityValues,
      maxMotive: this.maxMotive,
    });
    this.emotionManager = new EmotionManager();
  }

  setEventHandlers() {
    const icon = this.getOutputs().icon;
    const personalityValues = this.getPersonalityValues();
    const maxMotive = this.getMaxMotive();

    this.eventHandlers.petStart = () => {
      this.goalManager.addGoal(this, goalList.pet, {
        priority: 1,
        suspended: false,
        ticks: 5,
        tickModifiers: {
          personality: personalityValues,
          maxMotive: maxMotive,
        },
      });
    };
    icon.addEventListener('mousedown', this.eventHandlers.petStart);

    this.eventHandlers.petStop = () => {
      this.goalManager.deleteGoal(goalList.pet);
    };
    icon.addEventListener('mouseup', this.eventHandlers.petStop);

    this.eventHandlers.itemAdded = (e) => {
      this.goalManager.addGoal(this, goalList.addedItem, {
        priority: 5,
        suspended: false,
        ticks: 1,
        target: e.detail,
      });
    };
    icon.addEventListener('addItem', this.eventHandlers.itemAdded);

    this.eventHandlers.itemDeleted = (e) => {
      this.goalManager.addGoal(this, goalList.missingItem, {
        priority: 5,
        suspended: false,
        ticks: 1,
        target: e.detail,
      });
    };
    icon.addEventListener('deleteItem', this.eventHandlers.itemDeleted);
  }

  update() {
    this.metabolismManager.update(this);
    this.goalManager.update(this);
    this.emotionManager.update(this);
  }

  showMotive(motive) {
    if (!motive) {
      this.outputs.bubble.style.display = 'none';
      return;
    }
    this.outputs.bubble.innerHTML = `<span>${motive}</span>`;
    this.outputs.bubble.style.display = 'block';
  }

  getOutputs() {
    return this.outputs;
  }

  getPersonalityValues() {
    return this.personality.values;
  }

  getPersonalityValue(value) {
    if (!(value in this.personality.values)) {
      console.error(`Error: no ${value} personality value found`);
      return;
    }
    return this.personality.values[value];
  }

  getEmotions() {
    return this.status.emotions;
  }

  getFavorites() {
    return this.personality.favorites;
  }

  getDesireThresholds() {
    return this.metabolismManager.getDesireThresholds();
  }

  getDesireThreshold(desire) {
    return this.metabolismManager.getDesireThreshold(desire);
  }

  getGoals() {
    return this.goalManager.getGoals();
  }

  getCurrentGoal() {
    return this.goalManager.getCurrentGoal();
  }

  setPlan(plan) {
    if (plan === this.getPlan()?.name) return;
    this.status.plan = plan ? new plans[plan]() : null;
  }

  getPlan() {
    return this.status.plan;
  }

  setState(state) {
    if (state === this.getState()?.name) return;
    this.status.state = new states[state]();
  }

  getState() {
    return this.status.state;
  }

  setOutputEl(type, el) {
    this.outputs[type] = el;
  }

  setOutput(type, val, setVal = false) {
    if (type === 'goals') {
      let table = document.createElement('table');
      let tr = document.createElement('tr');
      ['name', 'priority', 'suspended', 'ticks', 'target', 'calledBy'].forEach(
        (item) => {
          let th = document.createElement('th');
          th.innerHTML = item;
          tr.appendChild(th);
          table.appendChild(tr);
        }
      );
      for (let goal in val) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML = goal;
        tr.appendChild(td);
        ['priority', 'suspended', 'ticks', 'target', 'calledBy'].forEach(
          (item) => {
            let td = document.createElement('td');
            td.innerHTML = val[goal][item];
            tr.appendChild(td);
          }
        );
        table.appendChild(tr);
      }
      this.outputs[type].innerHTML = '';
      this.outputs[type].appendChild(table);
    } else {
      if (setVal) {
        this.outputs[type].value = val;
      } else {
        this.outputs[type].innerHTML = JSON.stringify(val);
      }
    }
  }
}
