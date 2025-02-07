import Plan from './Plan';
import { utilities } from '../../utils/Utilities';
import { adjectiveList, goalList, planList, stateList } from '../../defaults';


export default class PlanPushItemFromToybox extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.pushItemFromToybox;
  }

  execute(self) {
    self.setPlan(planList.pushItemFromToybox);

    let goals = self.getGoals();
    if (!goals[goalList.knockItemFromToybox]) {
      console.error(
        `Error: no relevant goal found for ${goalList.knockItemFromToybox}`
      );
    }
  
    let adj = '';
    let calledBy = goals[goalList.knockItemFromToybox].getCalledBy();
    switch (calledBy) {
      case 'goalEat':
        adj = adjectiveList.tasty;
        break;
      case 'goalDrink':
        adj = adjectiveList.wet;
        break;
      case 'goalSleep':
        adj = adjectiveList.restful;
        break;
      case 'goalChewToy':
        adj = adjectiveList.chew;
        break;
      case 'goalBounceToy':
        adj = adjectiveList.bounce;
        break;
      default:
    }
  
    let toybox = document.querySelector(`[data-world="${self.world}"]`);
    let buttons = Array.from(toybox.querySelectorAll('button'));
    if (adj) {
      let pref;
      if (adj === adjectiveList.tasty) {
        pref = self.getFavorites().flavor;
      }
      if (adj === adjectiveList.bounce || adj === adjectiveList.chew) {
        pref = self.getFavorites().color;
      }
      const nearbyItems = self.queries.getItemsByAdjective(self, adj);
      if (pref) {
        const preferredItems = nearbyItems.filter((item) => {
          const properties =
            adj === adjectiveList.tasty ? item.getFlavors() : item.getColors();
          return properties.includes(pref);
        });
        if (preferredItems.length) {
          nearbyItems = preferredItems;
        }
      }
      if (nearbyItems.length) {
        self.goalManager.deleteGoal(goalList.knockItemFromToybox);
        self.goalManager.unsuspendGoal(calledBy);
      } else {
        let interestingButtons = buttons.filter((button) => {
          return button.dataset.adjectives.split(',').includes(adj);
        });
        if (interestingButtons.length) {
          if (pref && self.queries.amIFinicky(self)) {
            const preferredButtons = interestingButtons.filter((button) => {
              const dataset =
                adj === adjectiveList.tasty
                  ? button.dataset.flavors
                  : button.dataset.colors;
              return dataset.split(',').includes(pref);
            });
            interestingButtons = preferredButtons;
          }
          self.setState(stateList.pushItemFromToybox);
          self.status.state.execute(self);
          const button =
            interestingButtons[utilities.rand(interestingButtons.length - 1)];
          button.click();
        } else {
          self.goalManager.deleteGoal(goalList.knockItemFromToybox);
          self.goalManager.unsuspendGoal(calledBy);
        }
      }
    } else {
      let interestingButtons = buttons.filter((button) => {
        return !button.classList.contains('item-active');
      });
      if (interestingButtons.length) {
        self.setState(stateList.pushItemFromToybox);
        self.status.state.execute(self);
        const button =
          interestingButtons[utilities.rand(interestingButtons.length - 1)];
        button.click();
      }
      self.goalManager.deleteGoal(goalList.knockItemFromToybox);
    }
  }
}
