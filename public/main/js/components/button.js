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
This class represents a generic button, when touched, it will send the query to the server.
*/
class Button extends PIXI.Sprite {

  constructor(img, triggerPhrase) {
    super(PIXI.loader.resources[img].texture);
    this.interactive = true;

    this.on('pointerdown', () => {
      interactiveCanvas.sendTextQuery(triggerPhrase);
    });

  }

}