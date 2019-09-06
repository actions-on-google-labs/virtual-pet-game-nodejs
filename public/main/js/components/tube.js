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
This class represents the tube which is unlocked when the user reaches level 3.
*/
class Tube extends PIXI.Sprite {
  constructor() {
    super(PIXI.loader.resources.tube_piece.texture);
    this.name = "maze";
    this.scale.set(0.7);
    this.position.set(-250, 360);
    this.interactive = true;
    this.visible = false;
    this.glowColor = NORMAL_GLOW_COLOR;
    this.brightening = true;
    this.glowFilter = new PIXI.filters.GlowFilter(5, 2, 0, this.glowColor, 0.5);
    this.filters = [this.glowFilter];
    this.on('pointerdown', this.onSendName.bind(this));
    this.pulsate();
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
    if (this.brightening) {
      this.glowFilter.distance += 0.5;
      this.glowFilter.outerStrength += 0.1;
    } else {
      this.glowFilter.distance -= 0.5;
      this.glowFilter.outerStrength -= 0.1;
    }
    if (this.brightening && this.glowFilter.outerStrength >= 10) {
      this.brightening = false;
    } else if (!this.brightening && this.glowFilter.outerStrength <= 2) {
      this.brightening = true;
    }
    requestAnimationFrame(this.pulsate.bind(this));
  }
}