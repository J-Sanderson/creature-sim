import { World } from "./World";

class WorldManager {
    constructor() {
      this.worlds = new Map();
    }
  
    addWorld(worldId, worldInstance) {
      this.worlds.set(worldId, worldInstance);
    }
  
    getWorld(worldId) {
      return this.worlds.get(worldId);
    }
  
    removeWorld(worldId) {
      this.worlds.delete(worldId);
    }
  }

  const worldManager = new WorldManager;

  export default worldManager;