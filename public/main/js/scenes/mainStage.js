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
This is a parent container of two scenes - home scene and maze scene. 
It allows the maze scene to slide into the main stage which creates the camera panning effect. 
*/
class MainStageScene extends PIXI.Container {
  constructor() {
    super();
    this.homeScene = new HomeScene();
    this.addChild(this.homeScene);
    this.mazeScene = new MazeScene();
    this.addChild(this.mazeScene);
    this.mazeScene.position.x = (this.mazeScene.width * -1);
    this.hamster = this.setupHamster();
    this.addChild(this.hamster);
  }

  hamsterSliding() {
    this.hamster.visible = true;
    this.slidingToMaze();
  }

  slidingToMaze() {
    if (this.mazeScene.position.x <= 0) {
      this.mazeScene.position.x += 5;
      this.homeScene.position.x += 5;
      requestAnimationFrame(this.slidingToMaze.bind(this));
    } else {
      this.goToHomeScene();
    }
  }

  goToHomeScene() {
    this.mazeScene.position.x = (this.mazeScene.width * -1);
    this.homeScene.position.x = 0;
    this.hamster.visible = false;
    this.homeScene.tube.visible = true;
    this.slidingTube();
  }

  slidingTube() {
    if (this.homeScene.tube.position.x <= -250) {
      this.homeScene.tube.position.x += 5;
      this.homeScene.tube.position.x += 5;
      requestAnimationFrame(this.slidingTube.bind(this));
    }
  }

  setupHamster() {
    let hamsterSprite = new PIXI.Sprite(
      PIXI.loader.resources.hamster_crawling.texture
    )
    hamsterSprite.scale.set(0.2);
    hamsterSprite.visible = false;
    hamsterSprite.position.x = 900;
    hamsterSprite.position.y = 400;
    return hamsterSprite;
  }
}