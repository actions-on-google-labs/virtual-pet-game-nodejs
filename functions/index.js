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

const functions = require('firebase-functions');
const util = require('./utilities');
const format = require('string-template');
const Owner = require('./domain/owner');

const FED_BADGE = util.getBadgeByName('fedBadge');
const PLAYED_BADGE = util.getBadgeByName('playedBadge');
const PLAYED_3TIMES_BADGE = util.getBadgeByName('played3TimesBadge');
const FED_3TIMES_BADGE = util.getBadgeByName('fed3TimesBadge');
const RICH_PROMPTS = require('./prompts/rich_prompts');
const PROMPTS = require('./prompts/static_prompts.json');

const DEFAULT_LIFE_SPAN = 5;
const LEVEL_TWO = 2;
const LEVEL_THREE = 3;
const PLAYED_BADGE_NAME = 'played badge';
const FED_BADGE_NAME = 'fed badge';
const RANDOM_FREQUENCY = 2;
const NICKNAME = 'Hammy';

const {
  dialogflow,
  BasicCard,
  Image,
  Suggestions,
  Table,
} = require('actions-on-google');

const app = dialogflow({ debug: true });
class DatabaseError extends Error { }

app.middleware(async (conv) => {
  try {
    const owner = await util.findOwnerByID(conv.user.id);
    conv.hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    if (owner) {
      conv.owner = owner;
      conv.pet = owner.pet();
      if (conv.pet) {
        const energyChange = util.calculatePetEnergySinceLastFed(owner);
        const happinessChange = util.calculatePetHappinessSinceLastPlayed(owner);
        if (energyChange || happinessChange) {
          await owner.update();
        }
      }
    }
  } catch (e) {
    throw new DatabaseError();
  }
});

app.catch((conv, error) => {
  if (error instanceof DatabaseError) {
    conv.ask(PROMPTS.database_error);
  }
})

app.intent('Default Welcome Intent', (conv) => {
  if (conv.owner) {
    const owner = conv.owner;
    const pet = conv.pet;
    const phrase = util.getPhrases(pet);
    const parameters = { name: owner.name(), petName: pet.name() };
    const sayingPhrase = util.getRandomPhrase(phrase.speech, parameters);
    if (pet) {
      let response = util.getRandomPhrase(PROMPTS.welcome_back_adopted.speech, parameters);
      response += sayingPhrase;
      conv.ask(`<speak>${response}</speak>`);
      if (conv.hasScreen) {
        let textPhrase = util.getRandomPhrase(PROMPTS.welcome_back_adopted.text, parameters);
        textPhrase += util.getRandomPhrase(phrase.text, parameters);
        conv.ask(new BasicCard({
          text: textPhrase,
          image: new Image({
            url: util.getImages(pet),
            alt: textPhrase,
          })
        }));
      }
    } else {
      const response = util.getRandomPhrase(PROMPTS.welcome_back_no_adopt.speech, parameters);
      conv.ask(`<speak>${response}</speak>`);
      conv.contexts.set('adopt_pet', DEFAULT_LIFE_SPAN);
    }
  } else {
    const response = util.getRandomPhrase(PROMPTS.welcome_first_time.speech, {});
    conv.ask(`<speak>${response}</speak>`);
    conv.contexts.set('register_user', DEFAULT_LIFE_SPAN);
  }
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
  }
});

app.intent('Feed pet', feedPet);

app.intent('Feed pet - repeat', feedPet);

app.intent('Play with pet', playWithPet);

app.intent('Play with pet - repeat', playWithPet);

app.intent('Show all my badges', (conv) => {
  conv.ask(PROMPTS.show_all_badges);
  const achievedBadges = conv.owner.achievedBadges();
  if (conv.hasScreen) {
    conv.ask(new Table({
      title: 'Here are all your badges',
      subtitle: 'To get to the next level, you must collect all the badges',
      image: new Image({
        url: 'https://avatars0.githubusercontent.com/u/23533486',
        alt: 'Actions on Google'
      }),
      columns: [
        {
          header: 'Name',
          align: 'LEADING',
        },
        {
          header: 'Description',
          align: 'LEADING',
        },
      ],
      rows: util.createTable(achievedBadges)
    }))
  }
});

app.intent('Show new badge', conv => {
  conv.ask(PROMPTS.show_new_badge);
  if (conv.hasScreen) {
    conv.ask(new BasicCard({
      text: `Here's your new badge!`,
      image: new Image({
        url: PLAYED_BADGE.image,
        alt: `Here's your new badge!`,
      })
    }));
    conv.ask(new Suggestions('Show all my badges'));
  }
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
  }

});

app.intent('Cancel intent', (conv) => {
  const pet = conv.pet;
  const response = format(PROMPTS.cancel, { petName: pet.name() });
  conv.close(`<speak>${response}</speak>`);
});

app.intent('What to feed', showFoodType);

app.intent('Feed without food', showFoodType);

app.intent('Give pet water', (conv) => {
  const pet = conv.pet;
  const response = format(PROMPTS.give_pet_water, { petName: pet.name() });
  conv.ask(`<speak>${response}</speak>`);
});

async function feedPet(conv, { foodType }, option) {
  const pet = conv.pet;
  try {
    let source = option;
    if (foodType) {
      source = foodType;
    }
    const food = util.findFoodTypeByName(source);
    const feedStatus = conv.owner.feed(pet, food);
    const parameters = { petName: pet.name(), foodResponse: food.response, foodAudio: food.audio, foodTitle: food.title };
    if (feedStatus === 'ok') {
      const response = util.getRandomPhrase(PROMPTS.feed_pet_ok.speech, parameters);
      const text = util.getRandomPhrase(PROMPTS.feed_pet_ok.text, parameters);
      const eatFrequency = pet.eatTimes();
      const isBadgeGranted = util.grantBadgeByLevel(conv, eatFrequency, FED_BADGE.title, FED_3TIMES_BADGE.title);
      if (isBadgeGranted && conv.owner.shouldMoveToNextLevel()) {
        const badgeName = conv.owner.level() === LEVEL_TWO ? 'fed 3 Times Badge' : 'fed badge';
        movingToNextLevel(conv, response, badgeName, food);
      } else if (isBadgeGranted) {
        sayGrantedBadge(conv, food, response, FED_BADGE, FED_3TIMES_BADGE);
      } else {
        const msg = util.getRandomPhrase(PROMPTS.feed_pet_msg.speech, { petName: pet.name() });
        continueWithoutNewBadge(conv, food, response, text, eatFrequency, msg);
      }
    } else if (feedStatus === 'too much') {
      const response = util.getRandomPhrase(PROMPTS.feed_pet_too_much.speech, parameters);
      conv.ask(response);
      if (conv.hasScreen) {
        conv.ask(new BasicCard({
          text: response,
          image: new Image({
            url: 'https://firebasestorage.googleapis.com/v0/b/virtual-pet2.appspot.com/o/full.png?alt=media&token=4c82bb29-1e98-4bac-8241-1ac44aacca42',
            alt: response,
          })
        }));
      }
    } else {
      const response = util.getRandomPhrase(PROMPTS.feed_pet_too_full.speech, parameters);
      conv.ask(response);
      if (conv.hasScreen) {
        conv.ask(new BasicCard({
          text: response,
          image: new Image({
            url: 'https://firebasestorage.googleapis.com/v0/b/virtual-pet2.appspot.com/o/stuffed.png?alt=media&token=51c7b0cd-45ad-4031-85a9-5bfd5afe8011',
            alt: response,
          })
        }));
      }
    }
    await conv.owner.update();
  } catch (e) {
    console.log('Feed pet failed, ', e);
    conv.ask(PROMPTS.feed_pet_error);
  }
};

async function playWithPet(conv, { activityType }) {
  const pet = conv.pet;
  try {
    const activity = util.findActivityTypeByName(activityType);
    const parameters = { petName: pet.name(), activityResponse: activity.response, activityAudio: activity.audio };
    if (pet.canPlay(activity)) {
      pet.play(activity);
      const response = util.getRandomPhrase(PROMPTS.play_with_pet.speech, parameters);
      const text = util.getRandomPhrase(PROMPTS.play_with_pet.text, parameters);
      const playFrequency = pet.playTimes();
      const isBadgeGranted = util.grantBadgeByLevel(conv, playFrequency, PLAYED_BADGE.title, PLAYED_3TIMES_BADGE.title);
      if (isBadgeGranted && conv.owner.shouldMoveToNextLevel()) {
        const badgeName = conv.owner.level() === LEVEL_TWO ? 'played 3 Times Badge' : 'played badge'
        movingToNextLevel(conv, response, badgeName, activity);
      } else if (isBadgeGranted) {
        sayGrantedBadge(conv, activity, response, PLAYED_BADGE, PLAYED_3TIMES_BADGE);
      } else {
        const msg = format(PROMPTS.play_with_pet_msg, { petName: pet.name() });
        continueWithoutNewBadge(conv, activity, response, text, playFrequency, msg);
      }
      await conv.owner.update();
    } else {
      const response = format(PROMPTS.play_with_pet_too_tired, parameters);
      conv.ask(`<speak>${response}</speak>`);
      conv.ask(new BasicCard({
        text: `Sorry, ${pet.name()} is too tired to play.`, // TO-DO: Add SSML Sound
        image: new Image({
          url: 'https://firebasestorage.googleapis.com/v0/b/virtual-pet2.appspot.com/o/stuffed.png?alt=media&token=51c7b0cd-45ad-4031-85a9-5bfd5afe8011',
          alt: `Sorry, ${pet.name()} is too tired to play.`,
        })
      }));
    }
  } catch (e) {
    console.log('Play with pet failed, ', e);
    conv.ask(PROMPTS.play_with_pet_error);
  }
};

function showFoodType(conv) {
  const response = PROMPTS.show_food_type;
  conv.ask(`<speak>${response}</speak>`);
  if (conv.hasScreen) {
    conv.ask(RICH_PROMPTS.food_carousel);
  }
}

function movingToNextLevel(conv, response, badgeName, type) {
  const pet = conv.pet;
  const parameters = { badgeName: badgeName, petName: pet.name() };
  if (badgeName === PLAYED_BADGE_NAME || badgeName === FED_BADGE_NAME) {
    response += format(PROMPTS.moving_to_level_two, parameters);
  } else {
    response += format(PROMPTS.moving_to_next_unlock_new_toy, parameters);
  }
  util.promoteToNextLevel(conv.owner);
  conv.ask(`<speak>${response}</speak>`);
  if (conv.hasScreen) {
    if (conv.owner.level() === LEVEL_THREE) {
      const unlockedActivity = util.findActivityTypeByName('ball');
      conv.ask(new BasicCard({
        text: ` Congratulations! You just unlocked a new toy for ${pet.name()}! Now, you can let ${pet.name()} running in the ball. ${pet.name()} looks very excited for the new toy! `,
        image: new Image({
          url: unlockedActivity.actionImage,
          alt: `Congratulations! You just unlocked a new toy for ${pet.name()}! Now, you can let ${pet.name()} running in the ball.`,
        })
      }));
      conv.ask(new Suggestions(['playing in the maze', 'running in the wheel', 'running in the ball']));
    } else {
      conv.ask(new Table({
        title: 'Here are the new badges you need to earn in this new level.',
        subtitle: 'To get to the next level, you must collect all the badges',
        image: new Image({
          url: type.image,
          alt: 'Actions on Google'
        }),
        columns: [
          {
            header: 'Name',
            align: 'LEADING',
          },
          {
            header: 'Description',
            align: 'LEADING',
          },
        ],
        rows: [
          {
            cells: ['Fed 3 times Badge', ' Earn this badge after you fed your pet 3 times'],
            dividerAfter: false,
          },
          {
            cells: ['Played 3 times Badge', ' Earn this badge after you played with your pet 3 times'],
            dividerAfter: true,
          },
        ],
      }))
      conv.ask(RICH_PROMPTS.activity_suggestion);
    }
  }
}

function sayGrantedBadge(conv, type, response, levelOneBadge, levelTwoBadge) {
  const pet = conv.pet;
  const badge = util.getBadgeByLevel(conv, levelOneBadge, levelTwoBadge);
  const parameters = { badgeSaying: badge.saying, petName: pet.name() };
  response += format(PROMPTS.say_granted_badge, parameters);
  if (type.audio) {
    response += `<audio src='${type.audio}'/>`;
  }
  conv.ask(`<speak>${response}</speak>`);
  conv.ask(RICH_PROMPTS.activity_suggestion);
}

function continueWithoutNewBadge(conv, type, response, text, frequency, msg) {
  if (parseInt(frequency, 10) === RANDOM_FREQUENCY) {
    response += msg
  }
  conv.ask(`<speak>${response}</speak>`);
  if (conv.hasScreen) {
    conv.ask(new BasicCard({
      text: text,
      image: new Image({
        url: type.actionImage,
        alt: text,
      })
    }));
    conv.ask(RICH_PROMPTS.activity_suggestion);
  }
}

async function registerOwner(conv, name) {
  const level = 1;
  const pendingBadges = util.getBadgesByLevel(level);
  const achievedBadges = [];
  const owner = new Owner(conv.user.id, name, pendingBadges, achievedBadges, level);
  try {
    await owner.register();
    const response = util.getRandomPhrase(PROMPTS.register_user.speech, { name: owner.name() });
    conv.ask(`<speak>${response}</speak>`);
    const textPhrase = util.getRandomPhrase(PROMPTS.register_user.text);
    if (conv.hasScreen) {
      conv.ask(new BasicCard({
        text: textPhrase,
        image: new Image({
          url: 'https://firebasestorage.googleapis.com/v0/b/virtual-pet2.appspot.com/o/adopt.png?alt=media&token=0f132831-f815-4bed-96aa-1682037055d6',
          alt: textPhrase,
        })
      }));
    }
  } catch (e) {
    console.log('register owner failed, ', e);
    conv.ask(PROMPTS.register_user_error);
  }

}

exports.virtualPet2 = functions.https.onRequest(app);
