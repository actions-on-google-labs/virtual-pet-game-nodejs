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

const homeContainer = new PIXI.Container();

const HOME_CACHE_KEY = 'HOME';

const BOTTOM_OF_THE_BAR = 100;

/*
This is a scene which the user will see after they adopted the hamster and returned to the game.
*/
class HomeScene extends PIXI.Container {
  constructor() {
    super();
    this.blurredContainer = new PIXI.Container();
    this.addChild(this.blurredContainer);
    this.badgeSplash = new BadgeSplash();
    this.setupBackground();
    this.activitySprite = null;
    this.energyProgressBar = new ProgressBar("heart", "white_bar", "left");
    this.blurredContainer.addChild(this.energyProgressBar);
    this.happinessProgressBar = new ProgressBar("bear", "flipped_white_bar", "right");
    this.happinessProgressBar.position.x = 580;
    this.blurredContainer.addChild(this.happinessProgressBar);
    this.wheel = this.setupWheel();
    this.wheelItem = new InteractiveItem("wheel", "wheel");
    this.wheelItem.scale.set(0.18);
    this.wheelItem.position.set(260, 130);
    this.blurredContainer.addChild(this.wheelItem);
    this.carrotItem = new InteractiveItem("carrot", "carrot");
    this.carrotItem.rotation = 250;
    this.carrotItem.position.set(470, 450);
    this.blurredContainer.addChild(this.carrotItem);
    this.broccoliItem = new InteractiveItem("broccoli", "broccoli");
    this.broccoliItem.position.set(750, 280);
    this.broccoliItem.rotation = 250;
    this.blurredContainer.addChild(this.broccoliItem);
    this.seedsItem = new InteractiveItem("seeds", "seeds");
    this.seedsItem.position.set(610, 360);
    this.blurredContainer.addChild(this.seedsItem);
    this.ball = this.setupBall();
    this.blurredContainer.addChild(this.ball);
    const badgeButton = this.setupBadgeButton();
    this.blurredContainer.addChild(badgeButton);
    const rewindButton = this.setupRewindButton();
    this.blurredContainer.addChild(rewindButton);
    this.tube = new Tube();
    this.blurredContainer.addChild(this.tube);
  }

  removeWheelGlowing() {
    setTimeout(this.wheelItem.removeGlowing.bind(this), 5000);
  }

  showBadgeSplash(achievedBadges, pendingBadges, awardedBadgeName) {

    const badges = [];

    achievedBadges.forEach((badgeName) => {
      const badge = new Badge(badgeName);
      badges.push(badge);
    })

    if (awardedBadgeName) {
      badges.push(new Badge(awardedBadgeName));
    }

    console.log("pendingBadges: ", pendingBadges);
    pendingBadges.forEach((badgeName) => {
      const badge = new Badge(badgeName);
      badge.pending();
      badges.push(badge);
    })
    console.log("badges: ", badges);

    this.badgeSplash.setBadges(badges);
    this.showSplash();
    this.addChild(this.badgeSplash);
  }

  setupBackground() {
    let backgroundSprite = new PIXI.Sprite(
      PIXI.loader.resources.x_home.texture
    )
    this.blurredContainer.addChild(backgroundSprite);
  }

  setupBall() {
    let ball = new Ball(250, 305, app.view.width);
    ball.scale.set(0.30);
    return ball;
  }

  setupWheel() {
    let wheel = new Wheel();
    wheel.scale.set(0.18);
    return wheel;
  }

  setupBadgeButton() {
    const badgeButtonSprite = new Button("badgeIcon", "What badges do I have?");
    badgeButtonSprite.scale.set(0.8);
    badgeButtonSprite.position.x = this.width - badgeButtonSprite.width;
    badgeButtonSprite.position.y = this.height - badgeButtonSprite.height + 8;
    return badgeButtonSprite;
  }

  setupRewindButton() {
    const rewindButtonSprite = new Button("rewind_button", "Rewind the game");
    rewindButtonSprite.scale.set(0.8);
    rewindButtonSprite.position.x = this.width - (rewindButtonSprite.width*2);
    rewindButtonSprite.position.y = this.height - (rewindButtonSprite.height);
    return rewindButtonSprite;
  }

  onShowPetEating(foodName) {
    this.ball.stop();
    this.wheel.remove();
    if (this.activitySprite !== null) {
      this.blurredContainer.removeChild(this.activitySprite);
    }
    this.activitySprite = new PIXI.Sprite(
      PIXI.loader.resources[`eat_${foodName}`].texture
    )
    this.activitySprite.scale.set(0.8);
    this.activitySprite.position.set(450, 320);
    this.blurredContainer.addChild(this.activitySprite);
  }

  onShowPetPlaying(toyName) {
    if (this.activitySprite !== null) {
      this.blurredContainer.removeChild(this.activitySprite);
    }
    if (toyName === "ball") {
      this.ball.stop();
      this.ball.roll();
      this.wheel.remove();
    } else if (toyName === "wheel"){ // else if wheel
      this.wheel.remove();
      this.blurredContainer.addChild(this.wheel);
      this.wheel.spin();
    } else { // else maze
      this.parent.hamsterSliding();
    }
  }

  showSplash() {
    this.badgeSplash.center(this);
    this.blurredContainer.filters = [new PIXI.filters.BlurFilter()];
    setTimeout(this.removeSplash.bind(this), 3000);
  }

  removeSplash() {
    this.blurredContainer.filters = [];
    this.removeChild(this.badgeSplash);
  }
}

function showHomeScene(data) {
  if (activeScene) {
    app.stage.removeChild(activeScene);
  }
  // To create each scene instance once and reuse it later
  if (!containerCache[HOME_CACHE_KEY]) {
    containerCache[HOME_CACHE_KEY] = new MainStageScene();
  }
  activeScene = containerCache[HOME_CACHE_KEY];
  app.stage.addChild(activeScene);
  if(data.level >= 3) {
    activeScene.homeScene.tube.visible = true;
  } else {
    activeScene.homeScene.tube.visible = false;
  }
}