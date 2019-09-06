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

const FOOD_TYPES = require('../data/food.js');
const BROCCOLI = FOOD_TYPES.broccoli;
const CARROT = FOOD_TYPES.carrot;
const SUNFLOWER = FOOD_TYPES.sunflower_seed;

const {
  Image,
  Carousel,
  Suggestions,
} = require('actions-on-google');

const rich_prompts = {
  food_carousel: new Carousel({
    items: {
      broccoli: {
        title: 'Super broccoli',
        description: `Super broccoli will increase your pet's energy level by 1.`,
        image: new Image({
          url: BROCCOLI.image,
          alt: 'Super broccoli'
        })
      },
      carrot: {
        title: 'Delicious carrot',
        description: `Delicious carrot will increase your pet's energy level by 2.`,
        image: new Image({
          url: CARROT.image,
          alt: 'Delicious carrot'
        })
      },
      sunflower_seed: {
        title: 'Tasty Sunflower seed',
        description: `Tasty sunflower seed will increase your pet's energy level by 3.`,
        image: new Image({
          url: SUNFLOWER.image,
          alt: 'Tasty sunflower seed'
        })
      }
    }
  }),
  activity_suggestion: new Suggestions(["running in the wheel", "playing in the maze"])
};

module.exports = rich_prompts;
