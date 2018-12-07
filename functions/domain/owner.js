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

const admin = require('../database');
const db = admin.firestore();
const collectionRef = db.collection('owners');

const Pet = require('./pet');

const NORMAL_ENERGY = 5;
const NORMAL_HAPPINESS = 5;
const PLAY_TIMES = 0;
const EAT_TIMES = 0;

class Owner {
  constructor(id, name, pendingBadges, achievedBadges, level) {
    this._id = id;
    this._name = name;
    this._pet = null;
    this._pendingBadges = pendingBadges;
    this._achievedBadges = achievedBadges;
    this._level = level;
  }

  get name() { return this._name; }

  get id() { return this._id; }

  get pet() { return this._pet; }

  get pendingBadges() { return this._pendingBadges; }

  get achievedBadges() { return this._achievedBadges; }

  get level() { return this._level; }

  hasBadge(badgeName) {
    return this._achievedBadges.indexOf(badgeName) >=0;
  }

  adopt(name) {
    this._pet = new Pet(name, NORMAL_ENERGY, NORMAL_HAPPINESS, Date.now(), Date.now(), PLAY_TIMES, EAT_TIMES);
    return this.update();
  }

  feed(pet, food) {
    const feedStatus = pet.canEat(food);
    if (feedStatus == "ok") {
      pet.eat(food);
    }
    return feedStatus;
  }

  update() {
    return collectionRef.doc(this._id)
      .update({
        pet: this._pet.serialize(),
        pendingBadges: this._pendingBadges,
        achievedBadges: this._achievedBadges,
        level: this._level,
      });
  }

  register() {
    return collectionRef.doc(this._id)
      .set({
        name: this._name,
        pendingBadges: this._pendingBadges,
        achievedBadges: this._achievedBadges,
        level: this._level,
      });
  }

  shouldMoveToNextLevel(){
    return this.getPendingBadges().length === 0;
  }

  setLevel(level) {
    this._level = level;
  }

  setBadges(newBadges) {
    this._pendingBadges = newBadges;
  }
}

module.exports = Owner;
