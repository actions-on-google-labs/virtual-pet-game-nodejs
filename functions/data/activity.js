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
  "maze": {
    "title": "maze",
    "happiness": 2,
    "energy": 2,
    "image": `https://${firebaseConfig.projectId}.firebaseapp.com/images/maze.png`,
    "response": "playing in the maze ",
    "actionImage": `https://${firebaseConfig.projectId}.firebaseapp.com/images/maze.png`,
    "audio": "https://actions.google.com/sounds/v1/doors/turning_door_knob.ogg"
  },
  "wheel": {
    "title": "wheel",
    "happiness": 1,
    "energy": 1,
    "image": `https://${firebaseConfig.projectId}.firebaseapp.com/images/wheel.png`,
    "response": "running in the wheel ",
    "actionImage": `https://${firebaseConfig.projectId}.firebaseapp.com/images/wheel.png`,
    "audio": `https://actions.google.com/sounds/v1/impacts/crash_spinning_steel.ogg`
  },
  "ball": {
    "title": "ball",
    "happiness": 2,
    "energy": 2,
    "image": `https://${firebaseConfig.projectId}.firebaseapp.com/images/ball.png`,
    "response": "running in the ball ",
    "actionImage": `https://${firebaseConfig.projectId}.firebaseapp.com/images/ball.png`,
    "audio": `https://actions.google.com/sounds/v1/sports/pool_table_ball_return.ogg`
  }
}