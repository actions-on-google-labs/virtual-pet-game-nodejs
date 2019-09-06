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
  "broccoli": {
    "title": "broccoli",
    "energy": 1,
    "response": "some broccoli",
    "image": `https://${firebaseConfig.projectId}.firebaseapp.com/images/broccoli.png`,
    "actionImage": `https://${firebaseConfig.projectId}.firebaseapp.com/images/eat-broccoli.png`,
    "audio":
    `https://actions.google.com/sounds/v1/foley/eating_a_juicy_piece_of_fruit.ogg`
  },
  "carrot": {
    "title": "carrot",
    "energy": 2,
    "response": "a carrot",
    "image": `https://${firebaseConfig.projectId}.firebaseapp.com/images/carrot.png`,
    "actionImage": `https://${firebaseConfig.projectId}.firebaseapp.com/images/eat-carrot.png`,
    "audio":
    `https://actions.google.com/sounds/v1/foley/eating_a_juicy_piece_of_fruit.ogg`
  },
  "sunflower_seed": {
    "title": "sunflower seed",
    "energy": 3,
    "response": "some sunflower seeds",
    "image": `https://${firebaseConfig.projectId}.firebaseapp.com/images/seed.png`,
    "actionImage": `https://${firebaseConfig.projectId}.firebaseapp.com/images/eating-seed.png`,
    "audio":`https://actions.google.com/sounds/v1/human_voices/human_eating_peach.ogg`
  }
}
