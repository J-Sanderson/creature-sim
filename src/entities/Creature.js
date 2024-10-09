import Entity from './Entity';
import { GoalManager } from '../managers/GoalManager';
import { utilities } from '../utils/Utilities';
import { queries } from '../utils/Queries';
import states from '../state_machine/states/State';
import plans from '../state_machine/plans/Plan';
import goals from '../state_machine/goals/Goal';

export default class Creature extends Entity {
  static goalList = {
    drink: 'goalDrink',
    eat: 'goalEat',
    sleep: 'goalSleep',
    wander: 'goalWander',
    pet: 'goalBePetted',
    sitAround: 'goalSitAround',
    knockItemFromToybox: 'goalKnockItemFromToybox',
    chewToy: 'goalChewToy',
    bounceToy: 'goalBounceToy',
    cuddleToy: 'goalCuddleToy',
  };

  static planList = {
    wander: 'planWander',
    seekItem: 'planSeekItem',
    moveToItem: 'planMoveToItem',
    sleep: 'planSleep',
    eat: 'planEat',
    drink: 'planDrink',
    petHappy: 'planPetHappy',
    petAnnoyed: 'planPetAnnoyed',
    sitAround: 'planSitAround',
    moveToToybox: 'planMoveToToybox',
    pushItemFromToybox: 'planPushItemFromToybox',
    chewToy: 'planChewToy',
    bounceToy: 'planBounceToy',
    cuddleToy: 'planCuddleToy',
    moveFromItem: 'planMoveFromItem',
  };

  static stateList = {
    wander: 'stateMoveRandomly',
    seekItem: 'stateSeekItem',
    moveToPosition: 'stateMoveToPosition',
    sleep: 'stateSleep',
    eat: 'stateEat',
    drink: 'stateDrink',
    petHappy: 'statePetHappy',
    petAnnoyed: 'statePetAnnoyed',
    sitAround: 'stateSitAround',
    moveToToybox: 'stateMoveToToybox',
    pushItemFromToybox: 'statePushItemFromToybox',
    chewToy: 'stateChewToy',
    bounceToy: 'stateBounceToy',
    cuddleToy: 'stateCuddleToy',
  };

  static motiveIcons = {
    thirst: '&#x1F4A7;',
    hunger: '&#x1F374;',
    tired: '&#x1F634;',
    drink: '&#x1F445;',
    eat: '&#x1F37D;',
    sleep: '&#x1F4A4;',
    petHappy: '&#x1FA77;',
    petAnnoyed: '&#x1F620;',
    movingToTarget: '&#x1F43E;',
    sitAround: '&#x2601;',
    pushItemFromToybox: '&#x1F4A5;',
    chewToy: '&#x1F9B7;',
    bounceToy: '&#x26F9;',
    cuddleToy: '&#x1FAC2;',
  };

  static personalityValues = {
    liveliness: 'liveliness',
    patience: 'patience',
    naughtiness: 'naughtiness',
    metabolism: 'metabolism',
    playfulness: 'playfulness',
    finickiness: 'finickiness',
    kindness: 'kindness',
  };

  static validMotives = [
    Entity.motiveList.fullness,
    Entity.motiveList.hydration,
    Entity.motiveList.energy,
  ];

  static validFaves = {
    flavors: [
      Entity.flavorList.chicken,
      Entity.flavorList.beef,
      Entity.flavorList.fish,
    ],
    colors: [
      Entity.colorList.white,
      Entity.colorList.green,
      Entity.colorList.brown,
      Entity.colorList.red,
      Entity.colorList.orange,
      Entity.colorList.blue,
    ],
  };

  static adjectives = [Entity.adjectiveList.animate];

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

    this.personality = {
      values: {},
      favorites: {
        flavor: '',
      },
    };

    for (let value in Creature.personalityValues) {
      this.personality.values[Creature.personalityValues[value]] =
        utilities.rand(this.maxMotive);
    }
    let personalityValues = this.getPersonalityValues();

    this.personality.decayThresholds = {
      fullness: personalityValues.metabolism / this.maxMotive,
      hydration: 0.4 + personalityValues.liveliness / (this.maxMotive * 3),
      energy:
        1 -
        (1 - personalityValues.metabolism / this.maxMotive) *
          (1 + personalityValues.liveliness / this.maxMotive),
    };
    for (let threshold in this.personality.decayThresholds) {
      this.personality.decayThresholds[threshold] = Math.max(
        0,
        Math.min(1, this.personality.decayThresholds[threshold])
      );
    }

    this.personality.desireThresholds = {
      sleep: this.maxMotive * 0.2 - personalityValues.liveliness / 10,
      eat: this.maxMotive * 0.4 + personalityValues.metabolism / 10,
      drink: this.maxMotive * 0.4 + personalityValues.liveliness / 10,
    };

    this.personality.favorites.flavor =
      Entity.flavorList[
        Creature.validFaves.flavors[
          utilities.rand(Creature.validFaves.flavors.length)
        ]
      ];
    this.personality.favorites.color =
      Entity.colorList[
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

    this.eventHandlers.petStart = () => {
      this.goalManager.addGoal(this, Creature.goalList.pet, {
        priority: 1,
        suspended: false,
        ticks: 1,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
    };
    this.outputs.icon.addEventListener(
      'mousedown',
      this.eventHandlers.petStart
    );

    this.eventHandlers.petStop = () => {
      this.goalManager.deleteGoal(Creature.goalList.pet);
    };
    this.outputs.icon.addEventListener('mouseup', this.eventHandlers.petStop);

    this.goalManager = new GoalManager();
  }

  update() {
    this.metabolismManager();
    this.goalManager.update(this);
  }

  metabolismManager() {
    const personalityValues = this.getPersonalityValues();
    const decayThresholds = this.getDecayThresholds();

    // fullness decay
    if (this.status.state !== Creature.stateList.eat) {
      if (
        (this.status.state !== Creature.stateList.sleep ||
          Math.random() < 0.25) &&
        this.status.motives[Entity.motiveList.fullness] > 0
      ) {
        if (Math.random() < decayThresholds[Entity.motiveList.fullness]) {
          this.setMotive(
            Entity.motiveList.fullness,
            this.status.motives[Entity.motiveList.fullness] - 1
          );
        }
      }
    }
    if (
      !(Creature.goalList.eat in this.goalManager.getGoalList()) &&
      this.queries.amIHungry(this)
    ) {
      this.goalManager.addGoal(
        this,
        Creature.goalList.eat,
        {
          tickModifiers: {
            personality: this.getPersonalityValues(),
            maxMotive: this.getMaxMotive(),
          },
        },
        false
      );
    }

    // hydration decay
    if (this.status.state !== Creature.stateList.drink) {
      if (
        (this.status.state !== Creature.stateList.sleep ||
          Math.random() < 0.25) &&
        this.status.motives[Entity.motiveList.hydration] > 0 &&
        Math.random() < decayThresholds[Entity.motiveList.hydration]
      ) {
        this.status.motives[Entity.motiveList.hydration]--;
      }
    }
    if (
      !(Creature.goalList.drink in this.goalManager.getGoalList()) &&
      this.queries.amIThirsty(this)
    ) {
      this.goalManager.addGoal(
        this,
        Creature.goalList.drink,
        {
          tickModifiers: {
            personality: this.getPersonalityValues(),
            maxMotive: this.getMaxMotive(),
          },
        },
        false
      );
    }

    // energy decay
    if (
      this.status.state !== Creature.stateList.sleep &&
      this.status.motives[Entity.motiveList.energy] > 0
    ) {
      if (Math.random() < decayThresholds[Entity.motiveList.energy]) {
        this.setMotive(
          Entity.motiveList.energy,
          this.status.motives[Entity.motiveList.energy] - 1
        );
      }
    }
    if (
      !(Creature.goalList.sleep in this.goalManager.getGoalList()) &&
      this.queries.amITired(this)
    ) {
      this.goalManager.addGoal(
        this,
        Creature.goalList.sleep,
        {
          tickModifiers: {
            personality: this.getPersonalityValues(),
            maxMotive: this.getMaxMotive(),
          },
        },
        false
      );
    }
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

  getGoals() {
    return this.goalManager.getGoalList();
  }

  getCurrentGoal() {
    return this.goalManager.getCurrentGoal();
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

  getFavorites() {
    return this.personality.favorites;
  }

  getDecayThresholds() {
    return this.personality.decayThresholds;
  }

  getDecayThreshold(value) {
    if (!(value in this.personality.decayThresholds)) {
      console.error(`Error: no ${value} decay threshold found`);
      return;
    }
    return this.personality.decayThresholds[value];
  }

  getDesireThresholds() {
    return this.personality.desireThresholds;
  }

  getDesireThreshold(desire) {
    if (!(desire in this.personality.desireThresholds)) {
      console.error(`Error: no ${desire} threshold value found`);
      return;
    }
    return this.personality.desireThresholds[desire];
  }

  setState(state) {
    this.status.state = state;
  }

  setPlan(plan) {
    this.status.plan = plan;
  }

  getPlan() {
    return this.status.plan;
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
