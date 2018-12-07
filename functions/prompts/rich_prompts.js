'use strict';

const FOOD_TYPES = require('../data/food.json');
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
