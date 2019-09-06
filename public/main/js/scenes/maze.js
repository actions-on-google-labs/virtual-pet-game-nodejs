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

const mazeContainer = new PIXI.Container();

/*
This is a scene which the user will see when the hamster is playing in the maze.
*/
class MazeScene extends PIXI.Container {
  constructor() {
    super();
    this.background = this.setupMazeBackground();
    this.mazeTube = this.setupMaze();
  }

  setupMazeBackground() {
    let backgroundSprite = new PIXI.Sprite(
      PIXI.loader.resources.maze_background.texture
    )
    this.addChild(backgroundSprite);
  }

  setupMaze() {
    let mazeMainTubeSprite = new PIXI.Sprite(
      PIXI.loader.resources.maze_main_tube.texture
    )
    this.addChild(mazeMainTubeSprite);
  }
}