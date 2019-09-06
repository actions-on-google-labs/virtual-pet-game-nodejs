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
This class shows the progress of the energy and happiness level of the pet.
*/
class ProgressBar extends PIXI.Container {
  constructor(icon, barImage, direction) {
    super();
    this.icon = icon;
    this.items = [];
    this.direction = direction;
    const backgroundSprite = new PIXI.Sprite(
      PIXI.loader.resources[barImage].texture
    );
    backgroundSprite.height = 60;
    backgroundSprite.width = 420;
    backgroundSprite.position.set(10);
    this.addChild(backgroundSprite);
  }

  getInitialX() {
    if (this.direction === "left") {
      return 17;
    } else {
      return this.width - 40;
    }
  }

  setValue(number) {
    if (number > this.items.length) {
      const numOfAddedItems = number - this.items.length;
      let initialX = this.getInitialX();
      let multiplier = 1;

      if (this.direction === "right") {
        multiplier = -1;
      }

      if (this.items.length > 0) {
        const lastItem = this.items[this.items.length - 1];
        initialX = lastItem.x + (lastItem.width * multiplier);
      }

      for (let i = 0; i < numOfAddedItems; i++) {
        const newIconSprite = new PIXI.Sprite(
          PIXI.loader.resources[this.icon].texture
        );
        newIconSprite.width = 40;
        newIconSprite.height = 40;
        newIconSprite.position.x = initialX;
        initialX += (newIconSprite.width * multiplier);
        newIconSprite.position.y = 17;

        this.items.push(newIconSprite);
        this.addChild(newIconSprite);
      }
    } else {
      const numOfRemovedItems = this.items.length - number;
      for (let i = 0; i < numOfRemovedItems; i++) {
        let lastItem = this.items.pop();
        this.removeChild(lastItem);
      }
    }
  }

}