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

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

module.exports = {
  "welcome_back_adopted": {
    "speech": [
      "{name}! Welcome back! ",
      "Welcome Back {name}! "
    ],
    "text": [
      "{petName} missed you!",
      "{name}! Welcome back!"
    ]
  },
  "welcome_back_no_adopt": {
    "speech": [
      "Welcome back! {name}, last time you didn't adopt a pet. What do you want to name your hamster?",
      "Hello {name}! Welcome back! It looks like you don't have a pet from last visit. Let's get you a virtual pet! What do you want to name your hamster?"
    ],
    "text": [
      "Hello {name}! Welcome back! It looks like you don't have a pet from last visit. Let's get you a virtual pet! What do you want to name your hamster?",
      "Welcome back! {name}, last time you didn't adopt a pet. What do you want to name your hamster?"
    ]
  },
  "welcome_back_starving": {
    "speech": [
      `<audio src='https://actions.google.com/sounds/v1/human_voices/human_burp.ogg'/> {petName} is looking hungry today and can get a bite to eat. You can feed {petName} some  broccoli or a carrot. Which one would you like to feed {petName}?`,
      `{petName}'s stomach is growling. <audio src='https://actions.google.com/sounds/v1/human_voices/human_burp.ogg'/> Let's get {petName} some broccoli or a carrot?`
    ],
    "text": [
      "Looks like {petName} is starving and can get a bite to eat. Time to feed {petName}, do you want to give Larry a carrot or some broccoli?",
      "{petName}'s stomach is growling. Let's get {petName} some broccoli or a carrot?"
    ]
  },
  "welcome_back_depressed": {
    "speech": [
      "{petName} seems a little depressed. Time to play with {petName}. {petName} likes to play in the ball or run in the wheel. Which one would you prefer?",
      "{petName} is sitting in the corner of the cage. Looks like {petName} is a bit blue. Let's play with {petName}!"
    ],
    "text": [
      "{petName} seems a little sad. Time to play with {petName}. {petName} likes to play in the ball or in the wheel. Which one should we have {petName} play??",
      "{petName} is sitting in the corner of the cage. Looks like {petName} is a bit blue. Time to play with {petName}! Should {petName} play in the ball or in the wheel?"
    ]
  },
  "welcome_back_excited": {
    "speech": [
      `{petName} is anxious to play! <audio src='https://actions.google.com/sounds/v1/animals/mouse_squeaking.ogg'/> Which one would you like to do? Playing in the ball or running in the wheel?`
    ],
    "text": [
      "{petName} is anxious to play! Which one would you like? Playing in the ball or running in the wheel?"
    ]
  },
  "welcome_back_random": {
    "speech": [
      "{petName} is waiting for you! As a caring owner, you'll be rewarded with different badges. Collect the badges to move on to the next level and unlock new food or toys for {petName}! You can start by playing or feeding {petName}.",
      " Remember to come back often and play with {petName}! The more you play with your pet, the happier they become. Let's start playing!"
    ],
    "text": [
      "{petName} is waiting for you! As a caring owner, you'll be rewarded with different badges. Collect the badges to move on to the next level and unlock new food or toys for {petName}! You can start by playing or feeding {petName}.",
      " Remember to come back often and play with {petName}! The more you play with your pet, the happier they become. Let's start playing!"
    ]
  },
  "welcome_first_time": {
    "speech": [
      `<audio src='https://actions.google.com/sounds/v1/cartoon/cowbell_ringing.ogg'/> <prosody rate='fast'>Welcome!</prosody> Welcome to Virtual Pet Game! We have a lovely hamster waiting for a home. Before we get started, please tell me your name.`,
      `<audio src='https://actions.google.com/sounds/v1/cartoon/cowbell_ringing.ogg'/>Welcome to Virtual Pet Game! You look like a hamster person! Let me show you a hamster who will brighten up your day. By the way, what's your name?`
    ],
    "text": [
      "Welcome to Virtual Pet Game! We have a lovely hamster waiting for a home. Before we get started, please tell me your name.",
      "Welcome to Virtual Pet Game! You look like a hamster person! Let me show you a hamster who will brighten up your day. By the way, what's your name?"
    ]
  },
  "register_user": {
    "speech": [
      " Nice to meet you, {name}. Taking on a pet is a big responsibility, so if you don't mind, I'd like to ask you a question or two. Now, a pet will need to be fed and exercised every day. Are you going to be able to feed and exercise your pet daily?"
    ],
    "text": [
      " Thank you {name}! Taking on a pet is a big responsibility, so if you don't mind, I'd like to ask you a question or two. Now, a pet will need to be fed and exercised every day. Are you going to be able to feed and exercise your pet daily?"
    ]
  },
  "register_user_error": "Sorry, something went wrong. Try again later",
  "adopt_pet": {
    "speech": [
      `<audio src='https://actions.google.com/sounds/v1/doors/door_open_close.ogg'/>That's such a good name. Before you take your pet home, there's a few things to mention. Be sure to check on your pet every day, otherwise they may get sick or hungry. Ready to bring {petName} home?`
    ],
    "text": [
      "That's such a good name. Before you take your pet home, there's a few things to mention. Be sure to check on your pet every day, otherwise they may get sick or hungry. Ready to bring {petName} home?"
    ]
  },
  "feed_pet_ok": {
    "speech": [
      "You just fed {petName} {foodResponse} <audio src='{foodAudio}' />",
      "{petName} is enjoying {foodResponse}",
      "Awesome! Looks like {petName} loves the {foodTitle} <audio src='{foodAudio}' />",
      "{petName} is munching on the {foodTitle} <audio src='{foodAudio}' /> It looks like {foodTitle} can make {petName} more energetic",
      "<audio src='{foodAudio}' /> {petName} can't get enough of the {foodTitle}! This makes {petName} more energetic. "
    ],
    "text": [
      "You just fed {petName} {foodResponse}",
      "{petName} is enjoying {foodResponse}",
      "Awesome! Looks like {petName} loves the {foodTitle}",
      "{petName} is munching on the {foodTitle}"
    ]
  },
  "feed_pet_msg": {
    "speech": [
      " The more you feed {petName}, the more energetic {petName} will become so you can play and make your pet happier",
      " You're doing a great job! Remember to feed {petName} every day, if not, as the time goes by, {petName} will not have enough energy to play."
    ],
    "text": [
      " The more you feed {petName}, the more energetic {petName} will become so you can play and make your pet happier",
      " You're doing a great job! Remember to feed {petName} every day, if not, as the time goes by, {petName} will not have enough energy to play."
    ]
  },
  "feed_pet_too_much": {
    "speech": [
      "{foodTitle} is too much for {petName} to eat. Maybe play with {petName} instead to consume some energy."
    ],
    "text": [
      "{foodTitle} is too much for {petName} to eat. Maybe play with {petName} instead to consume some energy."
    ]
  },
  "feed_pet_too_full": {
    "speech": [
      "{petName} is too full and can't eat any food right now. Come back tomorrow to check if {petName} is hungry. Sometimes, {petName} loves running at night and the next day, {petName} would love to be fed again. "
    ],
    "text": [
      "{petName} is too full and can't eat any food right now. You can play with {petName} to make {petName} happy!"
    ]
  },
  "feed_pet_error": "Sorry, I'm unable to feed the pet. Try again later",
  "play_with_pet_error": "Sorry, I'm unable to play with the pet. Try again later",
  "play_with_pet": {
    "speech": [
      "{petName} is {activityResponse} <audio src='{activityAudio}' /> Each activity consumes different levels of energy. Would you like to let {petName} play in the ball or the wheel?",
      "{petName} loves {activityResponse}!<audio src='{activityAudio}' /> Wow, your hamster is a beast! You can keep playing with {petName}. ",
      "{petName} is getting fit. Each activity consumes different levels of energy. You can keep playing with {petName}. Would you like to let {petName} play in the ball or the wheel? ",
      "{petName} is burning calories by {activityResponse} <audio src='{activityAudio}' />"
    ],
    "text": [
      "{petName} is {activityResponse}",
      "{petName} loves {activityResponse}! Wow, your hamster is a beast! ",
      "{petName} is getting fit. ",
      "{petName} is burning calories by {activityResponse}"
    ]
  },
  "play_with_pet_msg": "The happier {petName} becomes, the healthier your hamster. So play with {petName} more often and unlock new activities you can do with your hamster! To continue playing with {petName}, you can either select the ball or the wheel. Which one would you like {petName} to play?",
  "play_with_pet_too_tired": `<audio src='https://actions.google.com/sounds/v1/human_voices/male_sick_breathing.ogg'/> Sorry, {petName} is too tired to play. Feed {petName} to boost up the energy level! Then you can play with your pet again!`,
  "play_with_too_happy": "Sorry, {petName} is too played out. Let {petName} rest and come back to play with {petName} tomorrow.",
  "play_with_must_eat": "Sorry, {petName} needs to eat in order to have enough energy to play.",
  "show_new_badge": "You got it! Here's your new badge.",
  "show_all_badges": "Here are all your badges. <mark name='SHOW_BADGE'/>",
  "moving_to_level_two": `You earned a {badgeName} <mark name="SHOW_BADGE"/><audio src='https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'/> Because you have collected two badges, Now, you're moving to level two! Keep taking good care of {petName} by feeding or playing with {petName}. Would you like to play with {petName} by having them running in the ball or in the wheel? `,
  "moving_to_next_unlock_new_toy": ` Because you make {petName} happy by playing with them so often. You earned a {badgeName} <mark name="SHOW_BADGE"/> <audio src='https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'/> and you just unlocked a new toy for {petName}! <mark name="SHOW_MAZE_SCENE"/> {petName} looks very excited for the maze! To start playing in the maze, simply select the maze by saying it.`,
  "say_granted_badge": ` and you earned a {badgeSaying}.<mark name="SHOW_BADGE"/> <audio src='https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'/> Now, time to play with {petName}. {petName} loves running in the wheel and in the ball. Which one would you like {petName} to play in?`,
  "give_nickname": "Alright, I'll just call you Terry then.",
  "choose_different_pet": `Sorry, we just sold the last {animal}. You'll just have to stick with this hamster. Trust me, you will love this little ball of fur<audio src='https://actions.google.com/sounds/v1/animals/mouse_squeaking.ogg'/>`,
  "help": "You can play with your hamster or feed your pet. There are 3 options for food and 2 options for things to do. As you progress in this game, you will unlock new food or activity for your pet. So do come back often! Now, you can choose broccoli, carrot or sunflower seed. Or you can play with your hamster in the ball or in the wheel.",
  "cancel": "{petName} will miss you! Come back to check on {petName}",
  "give_pet_water": `{petName} is thirsty!<audio src='https://actions.google.com/sounds/v1/foley/drink_and_swallow.ogg'/>`,
  "show_food_type": "You can feed your pet broccoli, carrot or sunflower seeds. Which one would you like?",
  "database_error": "Sorry, something went wrong. Check back later."
}