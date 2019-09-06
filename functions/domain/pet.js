/**
Copyright 2019 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

const MAX_ENERGY = 10;
const MAX_HAPPINESS = 10;
const LOWER_BOUND_ENERGY = 3;
class Pet {

  /**
   * @param {string} name What the pet is called
   * @param {number} energy The energy level of the pet
   * @param {number} happiness The happiness level of the pet
   * @param {number} energyLevelLastUpdated The date/time in milliseconds
   */
  constructor(name, energy, happiness, energyLevelLastUpdated, happinessLevelLastUpdated, playTimes, eatTimes, adoptionDate) {
    this.name = name;
    this.energy = energy;
    this.happiness = happiness;
    this.energyLevelLastUpdated = energyLevelLastUpdated;
    this.happinessLevelLastUpdated = happinessLevelLastUpdated;
    this.playTimes = playTimes;
    this.eatTimes = eatTimes;
    this.adoptionDate = adoptionDate;
  }

  energyLevelLastUpdatedTime() { return this.energyLevelLastUpdated; }

  happinessLevelLastUpdatedTime() { return this.happinessLevelLastUpdated; }

  decrementEnergyLevel(days) {
    this.energy -= days;
    this.energyLevelLastUpdated = Date.now();
  }

  decrementHappinessLevel(days) {
    this.happiness -= days;
    this.happinessLevelLastUpdated = Date.now();
  }

  eat(food) {
    const energy = food.energy;
    this.energy += energy;
    this.energyLevelLastUpdated = Date.now();
    this.eatTimes++;
  }

  canEat(food) {
    if (this.energy == MAX_ENERGY) {
      return 'full';
    } else if (this.energy + food.energy > MAX_ENERGY) {
      return 'too much'
    }
    return 'ok';
  }

  play(activity) {
    const happiness = activity.happiness;
    this.happiness += happiness;
    const energy = activity.energy;
    this.energy -= energy;
    this.playTimes++;
  }

  canPlay(activity) {
    if (this.energy < LOWER_BOUND_ENERGY) {
      return 'must_eat';
    } else if (this.energy - activity.energy <= 0) {
      return 'lack_of_energy';
    } else if (this.happiness + activity.happiness >= MAX_HAPPINESS) {
      return 'happy';
    }
    return 'ok';
  }

  resetPlayTimes() {
    this.playTimes = 0;
  }

  resetEatTimes() {
    this.eatTimes = 0;
  }

  // return the pet object
  serialize() {
    return {
      name: this.name,
      energy: this.energy,
      happiness: this.happiness,
      energyLevelLastUpdated: this.energyLevelLastUpdated,
      happinessLevelLastUpdated: this.happinessLevelLastUpdated,
      playTimes: this.playTimes,
      eatTimes: this.eatTimes,
      adoptionDate: this.adoptionDate
    }
  }

}

module.exports = Pet;
