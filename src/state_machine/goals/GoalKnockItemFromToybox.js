import Goal from './Goal';
import {
  adjectiveList,
  personalityValueList,
  goalList,
  goalTypeList,
} from '../../defaults';

export default class GoalKnockItemFromToybox extends Goal {
  constructor(params) {
    super(params);
    this.type = goalTypeList.narrative;
  }
  filter(self, nonReactive = false) {
    const personalityValues = self.getPersonalityValues();
    const maxMotive = self.getMaxMotive();

    if (
      personalityValues.naughtiness <= maxMotive * 0.1 &&
      personalityValues.patience >= maxMotive * 0.1
    ) {
      return -1;
    }

    const goals = self.getGoals();
    const calledBy = goals[goalList.knockItemFromToybox]?.getCalledBy();
    if (calledBy) {
      let adj = '';
      switch (calledBy) {
        case goalList.sleep:
          adj = adjectiveList.restful;
          break;
        case goalList.eat:
          adj = adjectiveList.tasty;
          break;
        case goalList.drink:
          adj = adjectiveList.wet;
          break;
        case goalList.chewToy:
          adj = adjectiveList.chew;
          break;
        case goalList.bounceToy:
          adj = adjectiveList.bounce;
          break;
        case goalList.cuddleToy:
          adj = adjectiveList.soft;
          break;
      }
      if (adj && self.queries.getItemsByAdjective(self, adj).length) {
        return -1;
      }
    } else {
      let toybox = document.querySelector(`[data-world="${self.world}"]`);
      let buttons = Array.from(toybox.querySelectorAll('button'));
      if (buttons.every((button) => button.classList.contains('item-active'))) {
        return -1;
      }
    }

    if (
      calledBy !== goalList.sleep &&
      calledBy !== goalList.eat &&
      calledBy !== goalList.drink &&
      personalityValues.naughtiness < maxMotive * 0.9 &&
      personalityValues.patience > maxMotive * 0.1
    ) {
      return -1;
    }

    let priority = 5;

    const patienceModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.patience,
      false
    );
    priority -= patienceModifier;

    const kindnessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.kindness,
      false
    );
    priority -= kindnessModifier;

    const naughtinessModifier = this.calculatePersonalityModifier(
      self,
      personalityValueList.naughtiness,
      true
    );
    priority -= naughtinessModifier;

    priority = Math.max(1, priority);

    return priority;
  }
  execute(self) {
    const position = self.getPosition();
    const bounds = self.getBounds();
    if (position.y + 1 >= bounds.y) {
      self.plans.planPushItemFromToybox(self);
    } else {
      self.plans.planMoveToToybox(self);
    }
  }
}
