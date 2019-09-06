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
This class represents the ball and the user can select it to play with the pet.
*/
class Ball extends PIXI.Container {
  constructor(x, y, targetX) {
    super();
    this.brightening = true;
    this.glowColor = NORMAL_GLOW_COLOR;
    this.glowFilter = new PIXI.filters.GlowFilter(1, 1, 0, this.glowColor, 0.2);
    this.filters = [this.glowFilter];
    this.startX = x;
    this.startY = y;
    this.position.set(x, y);
    this.targetX = targetX;
    this.backBall = this.setupBackBall();
    this.runningHamster = this.setupRunningHamster();
    this.frontBall = this.setupFrontBall();
    this.animationID = null;
    this.interactive = true;
    this.pulsate();
    this.on('pointerdown', this.onSendName);
  }

  onSendName() {
    this.glowColor = ACTIVE_GLOW_COLOR;
    setTimeout(() => {
      this.glowColor = NORMAL_GLOW_COLOR;
    }, 3000);
    interactiveCanvas.sendTextQuery("ball");
  }

  pulsate() {
    this.glowFilter.color = this.glowColor;
    if (this.brightening) {
      this.glowFilter.distance += 0.05;
      this.glowFilter.outerStrength += 0.05;
    } else {
      this.glowFilter.distance -= 0.05;
      this.glowFilter.outerStrength -= 0.05;
    }
    if (this.brightening && this.glowFilter.outerStrength >= 4) {
      this.brightening = false;
    } else if (!this.brightening && this.glowFilter.outerStrength <= 2) {
      this.brightening = true;
    }
    requestAnimationFrame(this.pulsate.bind(this));
  }

  setupBackBall() {
    let backBallSprite = new PIXI.Sprite(
      PIXI.loader.resources.back_ball.texture
    )
    backBallSprite.anchor.set(0.5);
    backBallSprite.scale.set(0.8);
    this.addChild(backBallSprite);
    backBallSprite.position.set(this.width / 2, this.height / 2);
    return backBallSprite;
  }

  setupRunningHamster() {
    let runningHamsterSprite = new PIXI.Sprite(
      PIXI.loader.resources.running_hamster.texture
    )
    runningHamsterSprite.visible = false;
    runningHamsterSprite.anchor.set(0.5);
    runningHamsterSprite.scale.set(0.8);
    runningHamsterSprite.position.set(this.width / 2, (this.height / 2));
    this.addChild(runningHamsterSprite);
    return runningHamsterSprite;
  }


  setupFrontBall() {
    let frontBallSprite = new PIXI.Sprite(
      PIXI.loader.resources.front_ball.texture
    )
    frontBallSprite.anchor.set(0.5);
    frontBallSprite.scale.set(0.8);
    frontBallSprite.position.set(this.width / 2, this.height / 2 );
    this.addChild(frontBallSprite);
    return frontBallSprite;
  }

  roll() {
    if (this.position.x < this.targetX) {
      this.runningHamster.visible = true;
      this.position.x += 5;
      this.backBall.rotation += 0.05;
      this.frontBall.rotation += 0.05;
      this.animationID = requestAnimationFrame(this.roll.bind(this));
    } else {
      this.runningHamster.visible = false;
      this.position.set(this.startX, this.startY);
    }
  }

  stop() {
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
      this.animationID = null;
    }
    this.runningHamster.visible = false;
    this.position.set(this.startX, this.startY);
  }

}