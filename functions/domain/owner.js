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

const admin = require('../database');
const db = admin.firestore();
const collectionRef = db.collection('owners');
const util = require('../utilities');

const Pet = require('./pet');

const NORMAL_ENERGY = 2;
const NORMAL_HAPPINESS = 2;
const PLAY_TIMES = 0;
const EAT_TIMES = 0;

class Owner {
  constructor(id, name, pendingBadges, achievedBadges, level) {
    this.id = id;
    this.name = name;
    this.pet = null;
    this.pendingBadges = pendingBadges;
    this.achievedBadges = achievedBadges;
    this.level = level;
  }

  hasBadge(badgeName) {
    return this.achievedBadges.indexOf(badgeName) >=0;
  }

  adopt(name) {
    console.log('adopt before update: ', this.pet);
    this.pet = new Pet(name, NORMAL_ENERGY, NORMAL_HAPPINESS, Date.now(), Date.now(), PLAY_TIMES, EAT_TIMES, Date.now());
    return this.update();
  }

  feed(pet, food) {
    const feedStatus = pet.canEat(food);
    if (feedStatus == "ok") {
      pet.eat(food);
    }
    return feedStatus;
  }

  rewind(pendingBadges) {
    this.level = 1;
    this.pendingBadges = pendingBadges;
    this.achievedBadges = [];
    this.pet.energy = 2;
    this.pet.happiness = 2;
    this.pet.playTimes = 0;
    this.pet.eatTimes = 0;
    this.pet.energyLevelLastUpdated = Date.now();
    this.pet.happinessLevelLastUpdated = Date.now();
    return this.update();
  }

  update() {
    console.log('testing before update: ', this.pet);
    return collectionRef.doc(this.id)
      .update({
        pet: this.pet.serialize(),
        pendingBadges: this.pendingBadges,
        achievedBadges: this.achievedBadges,
        level: this.level,
      });
  }

  register() {
    return collectionRef.doc(this.id)
      .set({
        name: this.name,
        pendingBadges: this.pendingBadges,
        achievedBadges: this.achievedBadges,
        level: this.level,
      });
  }

  shouldMoveToNextLevel(){
    return this.pendingBadges.length === 0;
  }

  setLevel(level) {
    this.level = level;
  }

  setBadges(newBadges) {
    this.pendingBadges = newBadges;
  }
}

module.exports = Owner;
