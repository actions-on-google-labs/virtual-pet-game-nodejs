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
This class shows all the achieved and pending badges.
*/
class BadgeSplash extends PIXI.Container {
  constructor() {
    super();
    this.lastX = 0;
  }

  addBadge(badge) {
    badge.position.x = this.lastX;
    this.lastX += badge.width + 5;
    this.addChild(badge);
  }

  setBadges(badges) {
    this.removeChildren();
    this.lastX = 0;
    badges.forEach((badge) => {
      this.addBadge(badge);
    })
  }

  center(home) {
    console.log('home width: ', home.width);
    console.log('home height: ', home.height);
    this.position.x = home.width/2 - this.width/2;
    this.position.y = home.height/2 - this.height/2;
  }
}