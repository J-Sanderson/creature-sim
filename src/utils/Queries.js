import worldManager from '../managers/WorldManager';
import { motiveList, personalityValueList } from '../defaults';

export const queries = {
  amIOnItem(self, id) {
    if (!id) {
      return false;
    }

    const item = self.queries.getItemFromWorld(self, id);
    if (!item) {
      return false;
    }

    const pos = self.getPosition();
    const itemPos = item.getPosition();
    return pos.x === itemPos.x && pos.y === itemPos.y;
  },
  amIHungry(self) {
    const faves = self.queries.getItemsByFlavor(
      self,
      self.getFavorites().flavor
    );
    let threshold = self.getDesireThreshold(motiveList.energy);
    if (!threshold) {
      return false;
    }
    if (faves.length) {
      threshold *= 1.1;
    }
    return self.getMotive(motiveList.fullness) < threshold;
  },
  amIThirsty(self) {
    const threshold = self.getDesireThreshold(motiveList.hydration);
    if (!threshold) {
      return false;
    }
    return self.getMotive(motiveList.hydration) < threshold;
  },
  amITired(self) {
    const threshold = self.getDesireThreshold(motiveList.energy);
    if (!threshold) {
      return false;
    }
    return self.getMotive(motiveList.energy) < threshold;
  },
  amIFinicky(self) {
    const finickiness = self.getPersonalityValue(
      personalityValueList.finickiness
    );
    const maxMotive = self.getMaxMotive();
    if (!finickiness || !maxMotive) {
      return false;
    }
    const ratio = finickiness / maxMotive;
    return Math.random() <= ratio;
  },
  getItemsByAdjective(self, adj) {
    const world = worldManager.getWorld(self.getWorld());
    if (!world) {
      return [];
    }
    const items = world.getItems();

    let interestingItems = [];
    items.forEach((item) => {
      if (item.getAdjectives().includes(adj)) {
        interestingItems.push(item);
      }
    });
    return interestingItems;
  },
  getItemsByFlavor(self, flavor) {
    const world = worldManager.getWorld(self.getWorld());
    if (!world) {
      return [];
    }

    const items = world.getItems();

    let interestingItems = [];
    items.forEach((item) => {
      if (item.getFlavors().includes(flavor)) {
        interestingItems.push(item);
      }
    });
    return interestingItems;
  },
  getItemFromWorld(self, id) {
    const world = worldManager.getWorld(self.getWorld());
    if (!world) {
      return null;
    }
    const items = world.getItems();
    return items.get(id);
  },
  getItemIAmOn(self) {
    const world = worldManager.getWorld(self.getWorld());
    if (!world) {
      return null;
    }
    const items = world.getItems();
    const pos = self.getPosition();

    let foundItem;
    items.forEach((item) => {
      if (!foundItem) {
        const itemPos = item.getPosition();
        if (pos.x === itemPos.x && pos.y === itemPos.y) {
          foundItem = item;
        }
      }
    });
    return foundItem;
  },
  getValidDirections(self) {
    const position = self.getPosition();
    const directions = [
      { dx: -1, dy: -1 }, // NW
      { dx: 0, dy: -1 }, // N
      { dx: 1, dy: -1 }, // NE
      { dx: 1, dy: 0 }, // E
      { dx: 1, dy: 1 }, // SE
      { dx: 0, dy: 1 }, // S
      { dx: -1, dy: 1 }, // SW
      { dx: -1, dy: 0 }, // W
    ];
    const bounds = self.getBounds();
    let validDirections = [];

    directions.forEach((direction) => {
      const newX = position.x + direction.dx;
      const newY = position.y + direction.dy;
      if (newX >= 0 && newX < bounds.x && newY >= 0 && newY < bounds.y) {
        validDirections.push(direction);
      }
    });

    return validDirections;
  },
};
