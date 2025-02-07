import Plan from './Plan';
import { adjectiveList, goalList, planList, stateList } from '../../defaults';

export default class PlanSeekItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.seekItem;
  }

  execute(self, adj, motive, goal) {
    let interestingItems = self.queries.getItemsByAdjective(self, adj);
    const position = self.getPosition();
  
    if (adj === adjectiveList.tasty && self.queries.amIFinicky(self)) {
      const pref = self.getFavorites().flavor;
      const preferredItems = interestingItems.filter((item) => {
        return item.getFlavors().includes(pref);
      });
      interestingItems = preferredItems;
    }
  
    if (adj === adjectiveList.bounce || adj === adjectiveList.chew) {
      const pref = self.getFavorites().color;
      const preferredItems = interestingItems.filter((item) => {
        return item.getColors().includes(pref);
      });
      if (preferredItems.length) {
        interestingItems = preferredItems;
      }
    }
  
    // get the closest of these
    let minDistance = Infinity;
    let closestItem = null;
    interestingItems.forEach((item) => {
      const itemPos = item.getPosition();
      const distance = Math.sqrt(
        (itemPos.x - itemPos.x) ** 2 + (position.y - position.y) ** 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
    });
  
    if (closestItem) {
      let goals = self.getGoals();
      if (goals.hasOwnProperty(goal)) {
        goals[goal].setTarget(closestItem.guid);
      }
    } else {
      self.goalManager.suspendGoal(goal);
      self.goalManager.addGoal(self, goalList.knockItemFromToybox, {
        calledBy: goal,
        tickModifiers: {
          personality: self.getPersonalityValues(),
          maxMotive: self.getMaxMotive(),
        },
      });
    }
  
    const itemPos = closestItem === null ? null : closestItem.getPosition();
    self.setState(stateList.seekItem);
    self.status.state.execute(self, motive, itemPos);
  }
}
