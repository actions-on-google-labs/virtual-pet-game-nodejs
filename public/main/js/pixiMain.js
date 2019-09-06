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

/**
 * 1. Only PIXI code goes here
 * 2. Function name convention - e.g showSceneAdoption, onEnergyBarUpdate
 */

'use strict';

let app = null;

let activeScene = null;

const containerCache = {};

function initializePixi(callback) {
  app = new PIXI.Application({
    backgroundColor: 0xFFFFFF,
    resizeTo: window
  });


  PIXI.loader
    .add("store_background", "/images/store_scene.jpg")
    .add("store_background_2", "/images/pet_store_1280x800_v2.png")
    .add("x_store", "/images/x_pet_store_1024X504.png")
    .add("x_home","/images/x_larry_home_1024X504.png")
    .add("adoption_form", "/images/Clipboard.png")
    .add("approval_stamp","/images/stamp.png")
    .add("hamster","/images/larry_normal.png")
    .add("home_background", "/images/larry_home_1280x800.png")
    .add("home_no_hanger_600", "/images/no_hanger_home_1024X600.png")
    .add("maze_background", "/images/background_1024x504.png")
    .add("maze_main_tube","/images/maze_1024x504.png")
    .add("hamster_crawling", "/images/imageonline-co-flipped.png")
    .add("white_bar", "/images/Rectangle.png")
    .add("flipped_white_bar", "/images/rectangle-flipped.png")
    .add("feed_button", "/images/feed.png")
    .add("play_button","/images/play.png")
    .add("broccoli","/images/broccoli.png")
    .add("carrot", "/images/carrot.png")
    .add("seeds", "/images/seeds.png")
    .add("wheel", "/images/wheel.png")
    .add("ball","/images/ball.png")
    .add("eat_broccoli", "/images/larry_eating_broccoli.png")
    .add("eat_sunflower_seed", "/images/larry_eating_seeds.png")
    .add("eat_carrot", "/images/larry_carrot_chomp_down.png")
    .add("play_ball", "/images/larry_in_ball.png")
    .add("play_wheel", "/images/larry_in_wheel.png")
    .add("heart", "/images/heart.png")
    .add("bear", "/images/bear.png")
    .add("front_ball", "/images/front-of-ball.png")
    .add("back_ball", "/images/back-of-ball.png")
    .add("running_hamster", "/images/larry-running-wheel.png")
    .add("back_wheel", "/images/back-wheel.png")
    .add("front_wheel", "/images/fornt-wheel.png")
    .add("back_wheel_stand", "/images/back-wheel-stand.png")
    .add("front_wheel_stand", "/images/front-wheel-stand.png")
    .add("fedBadge", "/images/resize.png")
    .add("playedBadge", "/images/resize_fit.png")
    .add("played3TimesBadge", "/images/resize_beast.png")
    .add("fed3TimesBadge", "/images/resize_foodie.png")
    .add("sleeping", "/images/larry_sleeping.png")
    .add("badgeIcon", "/images/badges%20home%20icon.png")
    .add("back_leg", "/images/crawl_back_leg.png")
    .add("front_arm", "/images/crawl_front_arm.png")
    .add("back_arm", "/images/crawl_back_arm.png")
    .add("rewind_button", "/images/rewind%20button.png")
    .add("indicator", "/images/clock.png")
    .add("tube_alone", "/images/tube_alone.png")
    .add("tube_piece", "/images/maze_tube_piece.png")
    .on("progress", loadProgressHandler)
    .load(callback);

}

function loadProgressHandler(loader, resource) {
  let percentage = (loader.progress + "").substring(0,2);
  $('#status').width(`${percentage}%`);
  $('#status').html(`${percentage}%`);
  console.log(`${percentage}%`);
  console.log(`loading: ${resource.url} `);
  console.log(`progress: ${loader.progress} %`);
}

