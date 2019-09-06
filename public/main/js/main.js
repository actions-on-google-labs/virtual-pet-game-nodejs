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

/**
 * This file is the entry point of the client side application and it initializes the interactive canvas callbacks which will update the UI. When the window is loaded, the pixi application is initialized and the header height will be adjusted as well.
 */
const callbacks = {};

callbacks.onUpdate = (data) => {
  console.log('new data: ', data);
  // Saving html response's data so that onTTSMark can use the data to do animations
  callbacks.html_data = data;
  switch (data.sceneState) {
    case 'WELCOME':
      showPetStoreScene();
      break;

    case 'SHOW_HOME':
      showHomeScene(data);
      break;

  }

  updateStatusBar(data, 'energy');
  updateStatusBar(data, 'happiness');

  if (data.actions) {
    data.actions.forEach((action) => {
      switch (action) {

        case 'SAVE_NAME':
          console.log('saved your name');
          break;

        case 'CONFIRM_ADOPT':
          console.log('you adopted a pet');
          activeScene.onShowAdoptionForm();
          break;

        case 'SHOW_STAMP':
          activeScene.onShowApprovalStamp();
          break;

        case 'SHOW_HAMSTER':
          activeScene.onShowHamster();
          break;

        case 'FED':
          activeScene.homeScene.onShowPetEating(data.foodType);
          break;

        case 'PLAYED':
          activeScene.homeScene.onShowPetPlaying(data.activityType);
          break;

      }
    });
  }
};

callbacks.onTtsMark = (markName) => {
  console.log('mark name: ', markName);
  if (markName === 'SHOW_BADGE') {
    const data = callbacks.html_data;
    activeScene.homeScene.showBadgeSplash(data.badgePanel.achievedBadges, data.badgePanel.pendingBadges, data.badgePanel.awardedBadge);
  } else if (markName === "SHOW_MAZE_SCENE") {
    activeScene.hamsterSliding();
  }
};

function updateStatusBar(data, type) {
  if (data.hasOwnProperty(type)) {
    if (type === 'energy') {
      activeScene.homeScene.energyProgressBar.setValue(data.energy);
    } else {
      activeScene.homeScene.happinessProgressBar.setValue(data.happiness);
    }
  }
}

// … callback definitions …
function initializeScene() {
  interactiveCanvas.getHeaderHeightPx()
    .then((height) => {
      $(document.body).css('margin-top', `${height}px`);

      initializePixi(function () {
        try {
          $('#splash').hide();
          document.body.appendChild(app.view);
          interactiveCanvas.ready(callbacks);
        } catch (error) {
          console.error(`Error initializing scene: ${error}`);
        }
      });
    });

}

window.addEventListener('load', initializeScene);
