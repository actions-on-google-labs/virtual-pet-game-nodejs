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

/*
This class represents the hamster crawling into the maze.
*/
class Hamster extends PIXI.Container {
  constructor() {
    super();
  }

  setupBackLeg() {
    let backLegSprite = new PIXI.Sprite(
      PIXI.loader.resources.back_leg.texture
    )
    backLegSprite.position.x = 300;
    backLegSprite.position.y = 500;
    this.addChild(backLegSprite);
  }

  setupBackArm() {
    let backArmSprite = new PIXI.Sprite(
      PIXI.loader.resources.back_arm.texture
    )
    backArmSprite.position.x = 400;
    backArmSprite.position.y = 500;
    this.addChild(backArmSprite);
  }

  setupFrontArm() {
    let frontArmSprite = new PIXI.Sprite(
      PIXI.loader.resources.front_arm.texture
    )
    frontArmSprite.position.x = 500;
    frontArmSprite.position.y = 500;
    this.addChild(frontArmSprite);
  }
}