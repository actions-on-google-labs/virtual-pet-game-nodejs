// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const MAX_ENERGY = 10;
const LOWER_BOUND_ENERGY = 3;
class Pet {

  /**
   * @param {string} name What the pet is called
   * @param {number} energy The energy level of the pet
   * @param {number} happiness The happiness level of the pet
   * @param {number} energyLevelLastUpdated The date/time in milliseconds
   */
  constructor(name, energy, happiness, energyLevelLastUpdated, happinessLevelLastUpdated, playTimes, eatTimes) {
    this._name = name;
    this._energy = energy;
    this._happiness = happiness;
    this._energyLevelLastUpdated = energyLevelLastUpdated;
    this._happinessLevelLastUpdated = happinessLevelLastUpdated;
    this._playTimes = playTimes;
    this._eatTimes = eatTimes;
  }

  get name() { return this._name; }

  get energy() { return this._energy; }

  get happiness() { return this._happiness; }

  get energyLevelLastUpdatedTime() { return this._energyLevelLastUpdated; }

  get happinessLevelLastUpdatedTime() { return this._happinessLevelLastUpdated; }

  get playTimes() { return this._playTimes; }

  get eatTimes() { return this._eatTimes; }

  decrementEnergyLevel(days) {
    this._energy -= days;
    this._energyLevelLastUpdated = Date.now();
  }

  decrementHappinessLevel(days) {
    this._happiness -= days;
    this._happinessLevelLastUpdated = Date.now();
  }

  eat(food) {
    const energy = food.energy;
    this._energy += energy;
    this._energyLevelLastUpdated = Date.now();
    this._eatTimes++;
  }

  canEat(food) {
    if (this._energy == MAX_ENERGY) {
      return 'full';
    } else if (this._energy + food.energy > MAX_ENERGY) {
      return 'too much'
    }
    return 'ok';
  }

  play(activity) {
    const happiness = activity.happiness;
    this._happiness += happiness;
    const energy = activity.energy;
    this._energy -= energy;
    this._playTimes++;
  }

  canPlay(activity) {
    if (this._energy < LOWER_BOUND_ENERGY) {
      return false;
    } else if (this._energy - activity.energy <= 0) {
      return false;
    }
    return true;
  }

  resetPlayTimes() {
    this._playTimes = 0;
  }

  resetEatTimes() {
    this._eatTimes = 0;
  }

  serialize() {
    return {
      name: this._name,
      energy: this._energy,
      happiness: this._happiness,
      energyLevelLastUpdated: this._energyLevelLastUpdated,
      happinessLevelLastUpdated: this._happinessLevelLastUpdated,
      playTimes: this._playTimes,
      eatTimes: this._eatTimes,
    }
  }

}

module.exports = Pet;
