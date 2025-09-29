import Plan from './Plan';
import {
  adjectiveList,
  goalList,
  planList,
  stateList,
  emotionList,
  personalityValueList,
} from '../../defaults';

export default class PlanSeekItem extends Plan {
  constructor(params) {
    super(params);

    this.name = planList.seekItem;
  }

  execute(self, adj) {
    // todo store adjective on goal token
    const goal = self.goalManager.getCurrentGoal();
    if (!goal) {
      console.error(`Error: no valid goal name found for ${this.name}`);
      return;
    }

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
      const knockItemPriority = self.goalManager.getPriorityForGoal(
        self,
        goalList.knockItemFromToybox
      );
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
          const randomDirection = Math.floor(
            Math.random() * validDirections.length
          );
          const { dx, dy } = validDirections[randomDirection];
          const position = self.getPosition();

          const newX = position.x + dx;
          const newY = position.y + dy;
          const goal =
            self.goalManager.getGoals()[self.goalManager.getCurrentGoal()];
          if (goal) {
            goal.setDirection(newX, newY);
          }

          const personalityValues = self.getPersonalityValues();
          const maxMotive = self.getMaxMotive();
          if (
            typeof personalityValues[personalityValueList.patience] !==
              'number' ||
            typeof personalityValues[personalityValueList.kindness] !== 'number'
          ) {
            console.error(
              `Error: no personality value found for ${personalityValues[personalityValueList.patience]} or ${personalityValues[personalityValueList.kindness]}`
            );
            return;
          }

          const roll = Math.random();
          const amISad =
            personalityValues[personalityValueList.patience] / maxMotive >
              roll &&
            personalityValues[personalityValueList.kindness] / maxMotive > roll;
          const emotion = amISad ? emotionList.sad : emotionList.angry;

          const emotions = self.getEmotions();
          if (!emotions.hasOwnProperty(emotionList.sad)) {
            console.error(`Error: no ${emotionList.sad} motive found`);
            return;
          }

          let increment = 10;
          let value = emotions[emotion] + increment;
          goal.setEmotion(self, {
            name: emotion,
            value,
          });

          increment = -1;
          value = emotions[emotionList.happy] + increment;
          goal.setEmotion(self, {
            name: emotionList.happy,
            value,
          });

          self.setState(stateList.seekItem);
          self.getState().execute(self);
        } else {
          console.error('No valid movement direction available');
        }
      }
    }
  }
}
