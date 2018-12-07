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

const Owner = require('../domain/owner');
const Pet = require('../domain/pet');

const admin = require('../database');
const db = admin.firestore();
const ownerCollectionRef = db.collection('owners');
const format = require("string-template");

const FOOD_TYPES = require('../data/food.json');
const ACTIVITY_TYPES = require('../data/activity.json');
const LEVELS = require('../data/levels.json');
const BADGES = require('../data/badges.json');
const PROMPTS = require('../prompts/static_prompts.json');

const LOWER_BOUND_ENERGY = 3;
const LOWER_BOUND_HAPPINESS = 3;
const HIGHER_BOUND_ENERGY = 8;
const HIGHER_BOUND_HAPPINESS = 8;
const THREE_TIMES_FREQUENCY = 3;
const ONE_DAY = 1000 * 60 * 60 * 24;

async function findOwnerByID(id) {
  const docRef = ownerCollectionRef.doc(id);
  const snapshot = await docRef.get();

  if (snapshot.exists) {
    const { name, pet, pendingBadges, achievedBadges, level } = snapshot.data();
    const owner = new Owner(snapshot.id, name, pendingBadges, achievedBadges, level);
    if (pet) {
      owner._pet = new Pet(pet.name, pet.energy, pet.happiness, pet.energyLevelLastUpdated, pet.happinessLevelLastUpdated, pet.playTimes, pet.eatTimes);
    }
    return owner;
  }
  console.log('Owner was not found');
  return undefined;
}

function normalize(item) {
  return item.toLowerCase().trim();
}

function findFoodTypeByName(foodType) {
  const normalizedFoodType = normalize(foodType);
  return FOOD_TYPES[normalizedFoodType];
}

function findActivityTypeByName(activityType) {
  const normalizedActivityType = normalize(activityType);
  if (ACTIVITY_TYPES.hasOwnProperty(normalizedActivityType)) {
    return ACTIVITY_TYPES[normalizedActivityType];
  }
  throw new Error(`'${activityType}' is not a valid activity`);
}

function grantBadge(owner, badgeName) {
  if (owner.hasBadge(badgeName)) {
    return false;
  }
  const badgeNameIndex = owner.pendingBadges().indexOf(badgeName);
  if (badgeNameIndex === -1) {
    return false;
  }
  owner.achievedBadges().push(badgeName);
  owner.pendingBadges().splice(badgeNameIndex, 1);
  return true;
};

function getBadgesByLevel(level) {
  level + "";
  const badges = LEVELS[level];
  if (badges) {
    return badges.concat([]);
  }
  throw new Error(`${level} is invalid.`);
}

function getBadgeByName(badgeName) {
  if (badgeName) {
    return BADGES[badgeName];
  }
  throw new Error(`${badgeName} is invalid.`);
}

function differenceInDays(from, to) {
  const from_ms = from.getTime();
  const to_ms = to.getTime();
  const difference_ms = to_ms - from_ms;
  return Math.round(difference_ms / ONE_DAY);
}

/**
 * return difference in days since last fed time
 * @param {*} pet
 * @param {*} currentTime
 */
function calculateDaysSince(lastUpdatedTime, currentTime) {
  const lastDate = new Date(lastUpdatedTime);
  return differenceInDays(lastDate, currentTime);
}

function calculatePetEnergySinceLastFed(owner) {
  const currentTime = new Date();
  const pet = owner.pet();
  const lastUpdatedTime = pet.energyLevelLastUpdatedTime();
  const days = calculateDaysSince(lastUpdatedTime, currentTime);
  if (days > 0) {
    pet.decrementEnergyLevel(days);
    return true;
  }
  return false;
}

function calculatePetHappinessSinceLastPlayed(owner) {
  const currentTime = new Date();
  const pet = owner.pet();
  const lastUpdatedTime = pet.happinessLevelLastUpdatedTime();
  const days = calculateDaysSince(lastUpdatedTime, currentTime);
  if (days > 0) {
    pet.decrementHappinessLevel(days);
    return true;
  }
  return false;
}

function getPhrases(pet) {
  if (pet.energy() <= LOWER_BOUND_ENERGY) {
    return PROMPTS.welcome_back_starving;
  } else if (pet.happiness() <= LOWER_BOUND_HAPPINESS) {
    return PROMPTS.welcome_back_depressed;
  } else if (pet.energy() >= HIGHER_BOUND_ENERGY) {
    return PROMPTS.welcome_back_excited;
  }
  return PROMPTS.welcome_back_random;
}

function getImages(pet) {
  const energy = pet.energy();
  const happiness = pet.happiness();
  if (energy <= LOWER_BOUND_ENERGY || happiness <= LOWER_BOUND_HAPPINESS) {
    return "https://firebasestorage.googleapis.com/v0/b/virtual-pet2.appspot.com/o/starving.png?alt=media&token=08ae3057-3b7a-455a-93c4-981afb359171";
  } else if (energy >= HIGHER_BOUND_ENERGY || happiness >= HIGHER_BOUND_HAPPINESS) {
    return "https://firebasestorage.googleapis.com/v0/b/virtual-pet2.appspot.com/o/named.png?alt=media&token=b2ebb1f7-f8d8-4f57-b98c-bd36b0829cbb";
  }
  return "https://firebasestorage.googleapis.com/v0/b/virtual-pet2.appspot.com/o/full.png?alt=media&token=4c82bb29-1e98-4bac-8241-1ac44aacca42";
}

/**
 * When promoting to the next level,
 *  - we increment the level
 *  - we reset pet's playTimes and fedTimes to zero
 *  - we get a new set of badges
 * @param {owner} owner
 */
function promoteToNextLevel(owner) {
  let level = owner.level();
  level = Number(level);
  level++;
  owner.setLevel(level);
  const pet = owner.pet();
  pet.resetPlayTimes();
  pet.resetEatTimes();
  if (LEVELS.hasOwnProperty(level + "")) {
    const newLevelBadges = getBadgesByLevel(level);
    owner.setBadges(newLevelBadges);
  }
}

function grantBadgeByLevel(conv, frequency, levelOneBadge, levelTwoBadge) {
  let isBadgeGranted = false;
  const currentLevel = conv.owner.level();
  switch (currentLevel) {
    case 1:
      isBadgeGranted = grantBadge(conv.owner, levelOneBadge);
      break;
    case 2:
      if (frequency === THREE_TIMES_FREQUENCY) {
        isBadgeGranted = grantBadge(conv.owner, levelTwoBadge);
      }
      break;
  }
  return isBadgeGranted;
}

function getBadgeByLevel(conv, levelOneBadge, levelTwoBadge) {
  let currentLevel = conv.owner.level();
  let badge = null;
  switch (currentLevel) {
    case 1:
      badge = levelOneBadge;
      break;
    case 2:
      badge = levelTwoBadge;
      break;
  }
  return badge;
}

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Picks a random phrase and format it with the parameters passed in
 * @param {*} phrases Array of phrases
 * @param {*} parameters Variables we're trying to extract
 */
function getRandomPhrase(phrases, parameters) {
  return format(random(phrases), parameters);
}

function createTable(achievedBadges) {
  const rows = [];
  for (let i = 0; i < achievedBadges.length; i++) {
    const badgeName = achievedBadges[i];
    const badge = getBadgeByName(badgeName);
    rows.push({ cells: [badge.saying, badge.description], dividerAfter: false })
  }
  return rows;
}

module.exports = {
  findOwnerByID,
  findFoodTypeByName,
  findActivityTypeByName,
  grantBadge,
  getBadgesByLevel,
  getBadgeByName,
  calculatePetEnergySinceLastFed,
  calculatePetHappinessSinceLastPlayed,
  getPhrases,
  getImages,
  promoteToNextLevel,
  grantBadgeByLevel,
  getBadgeByLevel,
  getRandomPhrase,
  createTable
};
