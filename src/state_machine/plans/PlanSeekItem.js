import Plan from './Plan';
import { adjectiveList, goalList, planList, stateList, emotionList } from '../../defaults';

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
      const knockItemPriority = self.goalManager.getPriorityForGoal(self, goalList.knockItemFromToybox);
      if (knockItemPriority >= 0) {
        self.goalManager.suspendGoal(goal);
        self.goalManager.addGoal(self, goalList.knockItemFromToybox, {
          calledBy: goal,
          tickModifiers: {
            personality: self.getPersonalityValues(),
            maxMotive: self.getMaxMotive(),
          },
        });
      } else {
        const validDirections = self.queries.getValidDirections(self);
        if (validDirections.length > 0) {
          const randomDirection = Math.floor(Math.random() * validDirections.length);
          const { dx, dy } = validDirections[randomDirection];
          const position = self.getPosition();
      
          const newX = position.x + dx;
          const newY = position.y + dy;

          self.setState(stateList.seekItem);
          self.getState().execute(self, motive, { x: newX, y: newY });
        } else {
          console.error('No valid movement direction available');
        }
      }
    }
  }
}
