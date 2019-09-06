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
This class represents the wheel and can be selected so that the hamster can play in the wheel.
*/
class Wheel extends PIXI.Container {
  constructor() {
    super();
    this.setupBackWheelStand();
    this.backWheel = this.setupBackWheel();
    this.runningHamster = this.setupRunningHamster();
    this.frontWheel = this.setupFrontWheel();
    this.setupFrontWheelStand();
    this.animationID = null;
    this.on('pointerdown', this.onSendName);
    this.position.x = 260;
    this.position.y = 140;
  }

  onSendName() {
    interactiveCanvas.sendTextQuery("wheel");
  }

  setupBackWheelStand() {
    let backWheelStandSprite = new PIXI.Sprite(
      PIXI.loader.resources.back_wheel_stand.texture
    )
    this.addChild(backWheelStandSprite);
  }

  setupBackWheel() {
    let backWheelSprite = new PIXI.Sprite(
      PIXI.loader.resources.back_wheel.texture
    )
    backWheelSprite.anchor.set(0.5);
    const x = this.width / 2;
    const y = this.height / 2 + 5;
    backWheelSprite.position.set(x, y);
    this.addChild(backWheelSprite);
    return backWheelSprite;
  }

  setupRunningHamster() {
    let runningHamsterSprite = new PIXI.Sprite(
      PIXI.loader.resources.running_hamster.texture
    )
    runningHamsterSprite.position.set(225, 250);
    runningHamsterSprite.scale.set(0.8);
    this.addChild(runningHamsterSprite);
    return runningHamsterSprite;
  }

  setupFrontWheel() {
    let frontWheelSprite = new PIXI.Sprite(
      PIXI.loader.resources.front_wheel.texture
    )
    frontWheelSprite.anchor.set(0.5);
    const x = this.width / 2 - 20;
    const y = this.height / 2 - 20;
    frontWheelSprite.position.set(x, y);
    this.addChild(frontWheelSprite);
    return frontWheelSprite;
  }

  setupFrontWheelStand() {
    let frontWheelStandSprite = new PIXI.Sprite(
      PIXI.loader.resources.front_wheel_stand.texture
    )
    this.addChild(frontWheelStandSprite);
  }

  spin() {
    this.backWheel.rotation += 0.05;
    this.frontWheel.rotation += 0.05;
    this.animationID = requestAnimationFrame(this.spin.bind(this));
  }

  remove() {
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
      this.animationID = null;
    }
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}