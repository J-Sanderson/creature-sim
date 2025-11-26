export class DebugManager {
  static statusOutputs = ['plan', 'state'];
  static goalOutputs = ['goals', 'currentGoalName'];

  showStatusWrapper(world) {
    let statusWrapper = document.createElement('div');
    statusWrapper.classList.add('status-wrapper');
    statusWrapper.innerHTML = '<p>Status</p>';
    world.elements.root.appendChild(statusWrapper);
    world.elements.statusWrapper = statusWrapper;
  }

  showCreatureStatus(world, creature) {
    let status = document.createElement('div');
    status.classList.add('status');
    status.innerHTML = `Creature: ${creature.getGUID()}`;

    const motives = creature.getMotives();
    for (let motive in motives) {
      let span = document.createElement('span');
      span.classList.add('status-item');
      span.classList.add('status-item-motive');
      let output = document.createElement('output');
      span.innerHTML = `${motive}: `;
      span.appendChild(output);
      status.appendChild(document.createElement('br'));
      status.appendChild(span);
      creature.setOutputEl(motive, output);
    }

    DebugManager.goalOutputs.forEach((item) => {
      let span = document.createElement('span');
      span.classList.add('status-item');
      span.classList.add('status-item-goal');
      let output = document.createElement('output');
      span.innerHTML = `${item}: `;
      span.appendChild(output);
      status.appendChild(document.createElement('br'));
      status.appendChild(span);
      creature.setOutputEl(item, output);
    });

    DebugManager.statusOutputs.forEach((item) => {
      let span = document.createElement('span');
      span.classList.add('status-item');
      span.classList.add('status-item-status');
      let output = document.createElement('output');
      span.innerHTML = `${item}: `;
      span.appendChild(output);
      status.appendChild(document.createElement('br'));
      status.appendChild(span);
      creature.setOutputEl(item, output);
    });

    world.elements.statusWrapper.appendChild(status);
  }

  updateCreatureStatus(creature) {
    const status = creature.getStatus();
    for (let motive in status.motives) {
      if (status.motives.hasOwnProperty(motive)) {
        creature.setOutput(motive, status.motives[motive]);
      }
    }

    const goal = creature.getCurrentGoalName();
    creature.setOutput('currentGoalName', goal);

    const plan = creature.getPlan();
    if (plan && plan.name) {
      creature.setOutput('plan', plan.name);
    }

    const state = creature.getState();
    if (state && state.name) {
      creature.setOutput('state', state.name);
    }

    const goals = creature.getGoals();
    creature.setOutput('goals', goals);
  }

  showCreatureSliders(world, creature) {
    // todo use labels for each slider
    let motiveSliders = document.createElement('fieldset');
    motiveSliders.classList.add('sliders');
    motiveSliders.classList.add('sliders-motives');

    const motives = creature.getMotives();
    for (let motive in motives) {
      let span = document.createElement('span');
      span.classList.add('slider-item');
      span.classList.add('slider-item-motive');
      let slider = document.createElement('input');
      slider.setAttribute('type', 'range');
      slider.setAttribute('min', 0);
      slider.setAttribute('max', world.params.maxMotive);
      slider.setAttribute('step', 1);
      slider.value = motives[motive];
      span.innerHTML = `${motive}: `;
      span.appendChild(slider);
      motiveSliders.appendChild(span);
      creature.setOutputEl(`slider-${motive}`, slider);

      slider.addEventListener('change', (e) => {
        creature.setMotive(motive, parseInt(e.target.value));
      });
    }

    world.elements.statusWrapper.appendChild(motiveSliders);

    let emotionSliders = document.createElement('fieldset');
    emotionSliders.classList.add('sliders');
    emotionSliders.classList.add('sliders-emotions');

    const emotions = creature.getEmotions();
    for (let emotion in emotions) {
      let span = document.createElement('span');
      span.classList.add('slider-item');
      span.classList.add('slider-item-emotion');
      let slider = document.createElement('input');
      slider.setAttribute('type', 'range');
      slider.setAttribute('min', 0);
      slider.setAttribute('max', world.params.maxMotive);
      slider.setAttribute('step', 1);
      slider.value = emotions[emotion];
      span.innerHTML = `${emotion}: `;
      span.appendChild(slider);
      emotionSliders.appendChild(span);
      creature.setOutputEl(`slider-${emotion}`, slider);

      slider.addEventListener('change', (e) => {
        creature.emotionManager.setEmotion(
          creature,
          emotion,
          parseInt(e.target.value)
        );
      });
    }

    world.elements.statusWrapper.appendChild(emotionSliders);
  }

  updateCreatureSliders(creature) {
    const status = creature.getStatus();
    for (let motive in status.motives) {
      if (status.motives.hasOwnProperty(motive)) {
        creature.setOutput(`slider-${motive}`, status.motives[motive], true);
      }
    }

    for (let emotion in status.emotions) {
      if (status.emotions.hasOwnProperty(emotion)) {
        creature.setOutput(`slider-${emotion}`, status.emotions[emotion], true);
      }
    }
  }

  showCreaturePersonality(world, creature) {
    let personality = document.createElement('p');
    personality.classList.add('personality');
    const personalityValues = creature.getPersonalityValues();
    for (let value in personalityValues) {
      let span = document.createElement('span');
      span.classList.add('personality-item');
      span.classList.add('personality-item-personality');
      span.innerHTML = `${value}: ${personalityValues[value]}`;
      personality.appendChild(span);
      personality.appendChild(document.createElement('br'));
    }

    world.elements.statusWrapper.appendChild(personality);

    let favorites = document.createElement('p');
    favorites.classList.add('favorites');
    const favoriteValues = creature.getFavorites();
    for (let value in favoriteValues) {
      let span = document.createElement('span');
      span.classList.add('personality-item');
      span.classList.add('personality-item-favorite');
      span.innerHTML = `${value}: ${favoriteValues[value]}`;
      favorites.appendChild(span);
      favorites.appendChild(document.createElement('br'));
    }

    world.elements.statusWrapper.appendChild(favorites);
  }
}
