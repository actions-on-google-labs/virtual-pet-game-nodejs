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

const functions = require('firebase-functions');

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const util = require('./utilities');
const format = require('string-template');
const Owner = require('./domain/owner');

const admin = require('./database');
const db = admin.firestore();
const ownerCollectionRef = db.collection('owners');


const FED_BADGE = util.getBadgeByName('fedBadge');
const PLAYED_BADGE = util.getBadgeByName('playedBadge');
const PLAYED_3TIMES_BADGE = util.getBadgeByName('played3TimesBadge');
const FED_3TIMES_BADGE = util.getBadgeByName('fed3TimesBadge');
const RICH_PROMPTS = require('./prompts/rich_prompts');
const PROMPTS = require('./prompts/static_prompts');

const DEFAULT_LIFE_SPAN = 5;
const LEVEL_TWO = 2;
const LEVEL_THREE = 3;
const PLAYED_BADGE_NAME = 'played badge';
const FED_BADGE_NAME = 'fed badge';
const RANDOM_FREQUENCY = 2;
const NICKNAME = 'Terry';

const {
  dialogflow,
  BasicCard,
  Image,
  Suggestions,
  Table,
  HtmlResponse,
} = require('actions-on-google');

const app = dialogflow({ debug: true });
class DatabaseError extends Error {
}

app.middleware(async (conv) => {
  util.generateUserId(conv);
  try {
    const owner = await util.findOwnerByID(conv.user.id);
    conv.hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    if (owner) {
      conv.owner = owner;
      conv.pet = owner.pet;
      if (conv.pet) {
        const energyChange = util.calculatePetEnergySinceLastFed(owner);
        const happinessChange = util.calculatePetHappinessSinceLastPlayed(owner);
        if (energyChange || happinessChange) {
          await owner.update();
        }
      }
    }
  } catch (e) {
    console.log(e);
    throw new DatabaseError();
  }
});

app.catch((conv, error) => {
  if (error instanceof DatabaseError) {
    conv.ask(PROMPTS.database_error);
    conv.ask(new HtmlResponse());
  } else {
    console.log('error in catch: ', error);
  }
});

app.intent('Default Welcome Intent', (conv) => {
  if (conv.owner && conv.owner.pet) {
    const pet = conv.pet;
    const starving_response = util.getRandomPhrase(PROMPTS.welcome_back_starving.speech, { petName: pet.name });
    const full_response = util.getRandomPhrase(PROMPTS.feed_pet_too_full.speech, { petName: pet.name });
    if (conv.owner.pet.energy < 3) {
      conv.ask(`<speak>Welcome back ${conv.owner.name}, ${starving_response} </speak>`);
    } else if (conv.owner.pet.energy > 9) {
      conv.ask(`<speak>Welcome back ${conv.owner.name}, ${full_response} </speak>`);
    } else if (conv.owner.pet.happiness < 3) {
      conv.ask(`<speak>Welcome back ${conv.owner.name}, ${conv.owner.pet.name} looks a little sad. You can have ${conv.owner.pet.name} play in the ball or in the wheel to cheer up your hamster! </speak>`);
    } else {
      conv.ask(`<speak> Welcome back ${conv.owner.name}, ${conv.owner.pet.name} is missing you. Time to play with ${conv.owner.pet.name}. Which one should we have him play? The ball or the wheel?</speak>`)
    }
    conv.contexts.set('play_game', 5);
    const htmlResponse = new HtmlResponse({
      url: `https://${firebaseConfig.projectId}.firebaseapp.com`,
      data: {
        sceneState: 'SHOW_HOME'
      }
    });
    sendResponseWithPetStatus(conv, htmlResponse);
  } else if (conv.owner) {
    conv.ask(`<speak>Welcome back ${conv.owner.name}, last time you didn't adopt a pet. Let's see if you're qualified to be a good owner. Are you able to feed and exercise your pet daily?</speak>`);
    conv.contexts.set('interview_phrase', 5);
    conv.contexts.set('Savename-followup', 2);
    conv.ask(new HtmlResponse({
      url: `https://${firebaseConfig.projectId}.firebaseapp.com`,
      data: {
        sceneState: 'WELCOME'
      }
    }));
  } else {
    const sound = `<audio src='https://actions.google.com/sounds/v1/cartoon/cowbell_ringing.ogg'/>`;
    const spokenPrompt = 'Welcome to Super Petz adoption event. I\'m so glad you\'re here. Are you interested in adopting a pet today?';
    conv.ask(`<speak>${sound}${spokenPrompt}</speak>`);
    conv.contexts.set('DefaultWelcomeIntent-followup', 2);
    conv.ask(new HtmlResponse({
      url: `https://${firebaseConfig.projectId}.firebaseapp.com`,
      data: {
        sceneState: 'WELCOME'
      }
    }));
  }
});

// Ask User's Name
app.intent('Default Welcome Intent - yes', (conv) => {
  const sound = `<audio src='https://actions.google.com/sounds/v1/foley/flipping_newspaper_pages.ogg'/>`;
  const spokenPrompt = 'That’s great, I’ll be helping you today. It’s nice to meet you. First things first, what’s your name that you’d like to put on the adoption form?';
  conv.ask(`<speak>${spokenPrompt}${sound}</speak>`);
  conv.ask(new HtmlResponse({
    data: {
      actions: ['CONFIRM_ADOPT']
    }
  }));
});

// Save User Name
app.intent('Save name', async (conv, { name }) => {
  await registerOwner(conv, name);
  conv.ask(new HtmlResponse({
    data: {
      actions: ['SAVE_NAME']
    }
  }));
});

// Animate Stamp
app.intent('Save name - yes', (conv) => {

  const pencilSound = `<audio src='https://actions.google.com/sounds/v1/foley/drawing_on_paper_with_charcoal.ogg'/>`;

  const hamsterSound = `<audio src='https://actions.google.com/sounds/v1/animals/mouse_squeaking.ogg'/>`;

  const spokenPrompt = 'That\'s great.  You seem qualified to continue with the adoption.  I\'m somewhat of a match maker when it comes to matching pets with the right owner, and I think I have the perfect pet for you.  They\'re cute, furry and ready to be your best friend.  Are you ready?';
  conv.ask(`<speak>${pencilSound}${spokenPrompt}${hamsterSound}</speak>`);
  conv.ask(new HtmlResponse({
    data: {
      actions: ['SHOW_STAMP']
    }
  }));
});

// Show Hamster and Ask For Pet's Name
app.intent('Save name - yes - yes', (conv) => {
  const sound = `<audio src='https://actions.google.com/sounds/v1/crowds/female_crowd_celebration.ogg'/>`;
  const spokenPrompt = 'The grand reveal! It\'s a hamster, just for you.';
  const spokenPrompt2 = 'Now, this hamster needs a name.  What do you think the name should be?';
  conv.ask(`<speak>${spokenPrompt}${sound}${spokenPrompt2}</speak>`);
  conv.ask(new HtmlResponse({
    data: {
      actions: ['SHOW_HAMSTER']
    }
  }));
});

// Ready to bring Larry home?
app.intent('Get pet name', async (conv, { petName }) => {
  // conv.user.storage.petName = petName;
  await conv.owner.adopt(petName);
  conv.pet = conv.owner.pet;
  const parameters = { petName: petName };
  console.log('parameters: ', parameters);
  const response = util.getRandomPhrase(PROMPTS.adopt_pet.speech, parameters);
  console.log('response: ', response);
  conv.ask(`<speak>${response}</speak>`);
  conv.ask(new HtmlResponse({
    data: {
      actions: ['SHOW_HAMSTER']
    }
  }));
});

// Show Home, Food and Toy choices
app.intent('Get pet name - yes', (conv) => {
  const petName = conv.pet.name;
  const footstep = `<audio src='https://actions.google.com/sounds/v1/foley/footsteps_solid_wood.ogg'/>`;
  const spokenPrompt = `This looks like a very cozy home for ${petName}. As a caring owner, you'll be rewarded with badges. Collect the badges to unlock new food and toys for your pet. Time to feed ${petName} so ${petName} will become more energized. You can feed ${petName} a carrot, some broccoli or seed. Which one do you want?`;
  conv.ask(`<speak>${footstep}${spokenPrompt}</speak>`);
  sendResponseWithPetStatus(conv, new HtmlResponse({
    data: {
      sceneState: 'SHOW_HOME'
    }
  }));
});

app.intent('Feed pet', feedPet);

app.intent('Play with pet', playWithPet);

app.intent('Cancel intent', (conv) => {
  const petName = conv.user.storage.petName;
  if (petName === undefined) {
    conv.close('See you next time.');
  }
  const response = `${petName} will miss you! Come back to check on ${petName}`;
  conv.close(`<speak>${response}</speak>`);

});

app.intent('Clear user storage', (conv) => {
  conv.user.storage = {};
  conv.ask('Okay, I cleared your data. What do you want to do now?');
});

app.intent('Rewind game', async (conv) => {
  const pendingB = util.getBadgesByLevel(1);
  await conv.owner.rewind(pendingB);
  conv.ask(`Okay you restarted the game! Time to feed ${conv.pet.name}. There are some broccoli, seeds and carrots. Which one would you like to feed them?`);
  const htmlResponse = new HtmlResponse({
    data: {
      sceneState: 'SHOW_HOME'
    }
  });
  sendResponseWithPetStatus(conv, htmlResponse);
});

app.intent('Register user', async (conv, { name }) => {
  await registerOwner(conv, name);
});

app.intent('Adopt pet', async (conv, { petName }) => {
  await conv.owner.adopt(petName);
  const parameters = { petName: petName };
  const response = util.getRandomPhrase(PROMPTS.adopt_pet.speech, parameters);
  conv.ask(`<speak>${response}</speak>`);

  if (conv.hasScreen) {
    conv.ask(RICH_PROMPTS.food_carousel);
    conv.ask(new HtmlResponse());
  }
});

app.intent('Feed pet - repeat', feedPet);

app.intent('Play with pet - repeat', playWithPet);

app.intent('Show all my badges', (conv) => {
  const response = PROMPTS.show_all_badges;
  conv.ask(`<speak>${response}</speak>`);
  const lastIndex = conv.owner.achievedBadges.length - 1;
  const htmlResponse = new HtmlResponse({
    data: {
      actions: ['SHOW_BADGE_PANEL'],
      badgePanel: {
        achievedBadges: conv.owner.achievedBadges.slice(0, lastIndex),
        pendingBadges: conv.owner.pendingBadges,
        awardedBadge: conv.owner.achievedBadges[lastIndex]
      }
    }
  });
  conv.ask(htmlResponse);
});

app.intent('Give nickname to user', async conv => {
  const response = PROMPTS.give_nickname;
  conv.ask(`<speak>${response}</speak>`);
  await registerOwner(conv, NICKNAME);
});

app.intent('Choose different pet', (conv, { animal }) => {
  const response = format(PROMPTS.choose_different_pet, { animal: animal });
  conv.ask(`<speak>${response}</speak>`);
});

app.intent('Help intent', (conv) => {
  const response = PROMPTS.help;
  conv.ask(`<speak>${response}</speak>`);
  if (conv.hasScreen) {
    conv.ask(RICH_PROMPTS.food_carousel);
    conv.ask(RICH_PROMPTS.activity_suggestion);
    conv.ask(new HtmlResponse());
  }
});

app.intent('Random Food', (conv, { randomFood }) => {
  const response = `Sorry, we don't have ${randomFood}. But you can feed ${conv.pet.name} broccoli, seeds or carrots. Which one do you want to feed ${conv.pet.name}?`;
  conv.ask(`<speak>${response}</speak>`);
  if (conv.hasScreen) {
    conv.ask(new HtmlResponse());
  }
});

app.intent('Give pet water', (conv) => {
  const pet = conv.pet;
  const response = format(PROMPTS.give_pet_water, { petName: pet.name });
  conv.ask(`<speak>${response}</speak>`);
  conv.ask(new HtmlResponse());
});

async function feedPet(conv, { foodType }) {
  const pet = conv.pet;
  const htmlResponse = new HtmlResponse({
    data: {
      actions: ['FED'],
      foodType: foodType
    }
  });

  try {
    const food = util.findFoodTypeByName(foodType);
    const feedStatus = conv.owner.feed(pet, food);
    const parameters = { petName: pet.name, foodResponse: food.response, foodAudio: food.audio, foodTitle: food.title };
    if (feedStatus === 'ok') {
      const response = util.getRandomPhrase(PROMPTS.feed_pet_ok.speech, parameters);
      const text = util.getRandomPhrase(PROMPTS.feed_pet_ok.text, parameters);
      const eatFrequency = pet.eatTimes;
      const isBadgeGranted = util.grantBadgeByLevel(conv, eatFrequency, FED_BADGE.title, FED_3TIMES_BADGE.title);
      if (isBadgeGranted && conv.owner.shouldMoveToNextLevel()) {
        const badgeName = conv.owner.level === LEVEL_TWO ? 'fed 3 Times Badge' : 'fed badge';
        movingToNextLevel(conv, response, htmlResponse, badgeName);
      } else if (isBadgeGranted) {
        sayGrantedBadge(conv, food, response, htmlResponse, FED_BADGE, FED_3TIMES_BADGE);
      } else {
        const msg = util.getRandomPhrase(PROMPTS.feed_pet_msg.speech, { petName: pet.name });
        continueWithoutNewBadge(conv, food, response, text, eatFrequency, msg);
      }
    } else if (feedStatus === 'too much') {
      const response = util.getRandomPhrase(PROMPTS.feed_pet_too_much.speech, parameters);
      conv.ask(response);
    } else {
      const response = util.getRandomPhrase(PROMPTS.feed_pet_too_full.speech, parameters);
      conv.ask(response);
    }
    await conv.owner.update();
    sendResponseWithPetStatus(conv, htmlResponse);
  } catch (e) {
    console.log('Feed pet failed, ', e);
    conv.ask(PROMPTS.feed_pet_error);
    conv.ask(new HtmlResponse());
  }
};

async function playWithPet(conv, { activityType }) {
  const pet = conv.pet;
  const htmlResponse = new HtmlResponse({
    data: {
      actions: [],
      activityType: activityType
    }
  });

  try {
    const activity = util.findActivityTypeByName(activityType);
    const parameters = { petName: pet.name, activityResponse: activity.response, activityAudio: activity.audio };

    const status = pet.canPlay(activity);
    if (status === 'ok') {
      // if maze, check if it is level 3
      pet.play(activity);
      htmlResponse.data.actions.push('PLAYED');
      const response = util.getRandomPhrase(PROMPTS.play_with_pet.speech, parameters);
      const text = util.getRandomPhrase(PROMPTS.play_with_pet.text, parameters);
      const playFrequency = pet.playTimes;
      const isBadgeGranted = util.grantBadgeByLevel(conv, playFrequency, PLAYED_BADGE.title, PLAYED_3TIMES_BADGE.title);
      if (isBadgeGranted && conv.owner.shouldMoveToNextLevel()) {
        const badgeName = conv.owner.level === LEVEL_TWO ? 'played 3 Times Badge' : 'played badge'
        movingToNextLevel(conv, response, htmlResponse, badgeName);
      } else if (isBadgeGranted) {
        sayGrantedBadge(conv, activity, response, htmlResponse, PLAYED_BADGE, PLAYED_3TIMES_BADGE);
      } else {
        const msg = format(PROMPTS.play_with_pet_msg, { petName: pet.name });
        continueWithoutNewBadge(conv, activity, response, text, playFrequency, msg);
      }
      await conv.owner.update();
    } else if (status === 'lack_of_energy') { // lack_of_energy
      const response = format(PROMPTS.play_with_pet_too_tired, parameters);
      conv.ask(`<speak>${response}</speak>`);
    } else if (status === 'happy') { // happy
      const response = format(PROMPTS.play_with_too_happy, parameters);
      conv.ask(`<speak>${response}</speak>`);
    } else { // must_eat
      const response = format(PROMPTS.play_with_must_eat, parameters);
      conv.ask(`<speak>${response}</speak>`);
    }
    sendResponseWithPetStatus(conv, htmlResponse);
  } catch (e) {
    console.log('Play with pet failed, ', e);
    conv.ask(PROMPTS.play_with_pet_error);
    conv.ask(new HtmlResponse());
  }
};

function movingToNextLevel(conv, response, htmlResponse, badgeName) {
  const pet = conv.pet;
  const parameters = { badgeName: badgeName, petName: pet.name };
  if (badgeName === PLAYED_BADGE_NAME || badgeName === FED_BADGE_NAME) {
    response += format(PROMPTS.moving_to_level_two, parameters);
  } else {
    response += format(PROMPTS.moving_to_next_unlock_new_toy, parameters);
    htmlResponse.data.actions.push('SHOW_MAZE_SCENE');
  }
  util.promoteToNextLevel(conv.owner);
  conv.ask(`<speak>${response}</speak>`);
  updateHtmlResponseWithBadge(conv, htmlResponse);
}

function sayGrantedBadge(conv, type, response, htmlResponse, levelOneBadge, levelTwoBadge) {
  const pet = conv.pet;
  const badge = util.getBadgeByLevel(conv, levelOneBadge, levelTwoBadge);
  const parameters = { badgeSaying: badge.saying, petName: pet.name };
  response += format(PROMPTS.say_granted_badge, parameters);
  if (type.audio) {
    response += `<audio src='${type.audio}'/>`;
  }
  conv.ask(`<speak>${response}</speak>`);
  updateHtmlResponseWithBadge(conv, htmlResponse);
}

function continueWithoutNewBadge(conv, type, response, text, frequency, msg) {
  if (parseInt(frequency, 10) === RANDOM_FREQUENCY) {
    response += msg
  }
  conv.ask(`<speak>${response}</speak>`);
}

async function registerOwner(conv, name) {
  const level = 1;
  const pendingBadges = util.getBadgesByLevel(level);
  const achievedBadges = [];
  const owner = new Owner(conv.user.id, name, pendingBadges, achievedBadges, level);
  try {
    await owner.register();
    const response = util.getRandomPhrase(PROMPTS.register_user.speech, { name: owner.name });
    conv.ask(`<speak>${response}</speak>`);
  } catch (e) {
    console.log('register owner failed, ', e);
    conv.ask(PROMPTS.register_user_error);
  }
}

function updateHtmlResponseWithBadge(conv, htmlResponse) {
  const state = htmlResponse.data;
  const badges_length = conv.owner.achievedBadges.length;
  const currentBadgeName = conv.owner.achievedBadges[badges_length - 1];
  const currentBadge = util.getBadgeByName(currentBadgeName);
  state.badge = {
    name: currentBadge.saying,
    image: currentBadge.image
  }
  state.actions.push("SHOW_BADGE_PANEL");
  const achievedBadges = conv.owner.achievedBadges.concat([]);
  const pendingBadges = conv.owner.pendingBadges.concat([]);
  achievedBadges.splice(-1, 1);
  state.badgePanel = {
    achievedBadges: achievedBadges,
    pendingBadges: pendingBadges,
    awardedBadge: currentBadgeName
  }
}

function sendResponseWithPetStatus(conv, htmlResponse) {
  const state = htmlResponse.data;
  state.energy = conv.pet.energy;
  state.happiness = conv.pet.happiness;
  state.level = conv.owner.level;
  conv.ask(htmlResponse);
}

exports.virtualPetMVP = functions.https.onRequest(app);
