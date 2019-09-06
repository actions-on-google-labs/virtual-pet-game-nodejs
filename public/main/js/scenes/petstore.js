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

const PETSTORE_CACHE_KEY = 'PETSTORE';

/*
This is a scene which the user will see when they go through the adoption process.
*/
class PetStoreScene extends PIXI.Container {
  constructor() {
    super();
    this.setupBackground();
    this.adoptionForm = this.setupAdoptionForm();
    this.stamp = this.setupApprovalStamp();
    this.hamster = this.setupHamster();
  }

  setupBackground() {
    let backgroundSprite = new PIXI.Sprite(
      PIXI.loader.resources.x_store.texture
    );
    this.addChild(backgroundSprite);
  }

  setupAdoptionForm() {
    let adoptionFormSprite = new PIXI.Sprite(
      PIXI.loader.resources.adoption_form.texture
    );
    adoptionFormSprite.scale.set(0.8);
    adoptionFormSprite.position.x = -800;
    adoptionFormSprite.position.y = 158;
    this.addChild(adoptionFormSprite);
    return adoptionFormSprite;
  }

  setupApprovalStamp() {
    let approvalStampSprite = new PIXI.Sprite(
      PIXI.loader.resources.approval_stamp.texture
    )
    approvalStampSprite.scale.set(1.1);
    approvalStampSprite.position.set(470, 350);
    approvalStampSprite.visible = false;
    this.addChild(approvalStampSprite);
    return approvalStampSprite;
  }

  setupHamster() {
    let hamsterSprite = new PIXI.Sprite(
      PIXI.loader.resources.hamster.texture
    )
    hamsterSprite.visible = false;
    hamsterSprite.position.set(400, 200);
    hamsterSprite.scale.set(0.9);
    this.addChild(hamsterSprite);
    return hamsterSprite;
  }

  onShowAdoptionForm() {
    this.adoptionForm.position.x += 5;
    if (this.adoptionForm.position.x < 150) {
      requestAnimationFrame(this.onShowAdoptionForm.bind(this));
    }
  }

  onShowApprovalStamp() {
    if (this.stamp.visible == false) {
      this.stamp.visible = true;
    }
    this.stamp.scale.x -= 0.01;
    this.stamp.scale.y -= 0.01;
    if (this.stamp.scale.x > 0.5) {
      requestAnimationFrame(this.onShowApprovalStamp.bind(this));
    }
  }

  onShowHamster() {
    this.adoptionForm.visible = false;
    this.stamp.visible = false;
    if (this.hamster.visible == false) {
      this.hamster.visible = true;
    }
  }
}

function showPetStoreScene() {
  if (activeScene) {
    app.stage.removeChild(activeScene);
  }
  if (!containerCache[PETSTORE_CACHE_KEY]) {
    containerCache[PETSTORE_CACHE_KEY] = new PetStoreScene();
  }
  activeScene = containerCache[PETSTORE_CACHE_KEY];
  app.stage.addChild(activeScene);
}