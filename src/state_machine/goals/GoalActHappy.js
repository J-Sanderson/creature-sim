import Goal from './Goal';
import { emotionList, goalList, planList } from '../../defaults';

export default class GoalActHappy extends Goal {
    constructor(params) {
        super(params);
        if (params && params.hasOwnProperty('tickModifiers')) {
            const modifiers = params.tickModifiers;
            if (
                modifiers.hasOwnProperty('maxMotive') &&
                modifiers.hasOwnProperty('emotions')
              ) {
                let ticks = this.getTicks();
                let adjustedTicks = this.calculateModifiedTicks(
                    modifiers.emotions[emotionList.happy],
                    modifiers.maxMotive,
                    ticks,
                );
                this.setTicks(adjustedTicks);

                let threshold = this.getDecayThreshold();
                let adjustedThreshold = this.calculateModifiedDecayThreshold(
                    modifiers.emotions[emotionList.happy],
                    modifiers.maxMotive,
                    threshold,
                );
                this.setDecayThreshold(adjustedThreshold);
            }
        }
    }

    filter(self, nonReactive = false) {
        const motives = self.getMotives();
        const motiveModifier = 0.1;
        const maxMotive = self.getMaxMotive();
    
        for (let motive in motives) {
          if (motives[motive] <= maxMotive * motiveModifier) {
            return -1;
          }
        }

        const goals = self.getGoals();
        if (
            goals.hasOwnProperty(goalList.eat) ||
            goals.hasOwnProperty(goalList.drink) ||
            goals.hasOwnProperty(goalList.sleep)
        ) {
            return -1;
        }

        const emotions = self.getEmotions();
        if (emotions[emotionList.happy] && emotions[emotionList.happy] <= maxMotive / 2) {
            return -1;
        }

        let priority = 7;
        const happinessModifier = this.calculateEmotionModifier(
            self,
            emotionList.happy,
        );

        priority -= happinessModifier;
        priority = Math.max(1, priority);

        return priority;
    }

    execute(self) {
        self.setPlan(planList.actHappy);
        self.getPlan().execute(self);

        this.decrementTicks();
        if (this.getTicks() <= 0) {
          self.goalManager.deleteGoal(goalList.actHappy);
        }
    }
}