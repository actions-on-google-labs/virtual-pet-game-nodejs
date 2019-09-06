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

const NORMAL_GLOW_COLOR = 0xBFEFFF;
const ACTIVE_GLOW_COLOR = 0xFFA500;

/*
This class is used to render the food or activity choice that the user can select to feed or play with the pet.
*/
class InteractiveItem extends PIXI.Sprite {
  constructor(name, img) {
    super(PIXI.loader.resources[img].texture);
    this.glowColor = NORMAL_GLOW_COLOR;
    this.brightening = true;
    this.glowFilter = new PIXI.filters.GlowFilter(5, 2, 0,this.glowColor , 0.5);
    this.filters = [this.glowFilter];
    this.name = name;
    this.interactive = true;
    this.scale.set(0.7);
    this.on('pointerdown', this.onSendName.bind(this));
    this.pulsate();
  }

  removeGlowing() {
    this.filters = [];
  }

  onSendName() {
    console.log("name: ", this.name);
    this.glowColor = ACTIVE_GLOW_COLOR;
    setTimeout(() => {
      this.glowColor = NORMAL_GLOW_COLOR;
    }, 3000);
    interactiveCanvas.sendTextQuery(this.name);
  }

  pulsate() {
    this.glowFilter.color = this.glowColor;
    if(this.brightening) {
      this.glowFilter.distance += 0.5;
      this.glowFilter.outerStrength  += 0.1;
    } else {
      this.glowFilter.distance -= 0.5;
      this.glowFilter.outerStrength  -= 0.1;
    }
    if(this.brightening && this.glowFilter.outerStrength >= 10){
      this.brightening = false;
    } else if(!this.brightening && this.glowFilter.outerStrength <= 2) {
      this.brightening = true;
    }
    requestAnimationFrame(this.pulsate.bind(this));
  }
}