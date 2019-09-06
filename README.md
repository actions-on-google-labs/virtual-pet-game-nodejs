# Actions on Google: Virtual Pet

**NOTE**

This is an experimental project and will receive minimal maintenance. Only bugs for security issues will be accepted. No feature requests will be accepted. Pull requests will be acknowledged and reviewed as soon as possible. There is no associated SLAs.

Some of the projects in this experimental org might mature to a more stable state and move into the main [Actions on Google GitHub org](https://github.com/actions-on-google).

---
![Virtual Pet](/public/images/game.png?raw=true "Virtual Pet")

In this game, you will adopt and take care of a hamster just like you would in real life, except through Google Assistant. To start the game, you would go through the adoption process which takes place at the pet store. After adopting your new pet, you can then begin to take care of it by playing and/or feeding it. This game has two different levels. In order to progress to the next level, players must collect the corresponding badges in each level; total 2 badges for each level. Each food choice affects the energy level of the hamster differently and each toy choice affects the happiness level of the hamster differently.

One unique element of this game is overtime if the player does not return to the game, both the energy and happiness level of the pet will go down. The hamster will become unhealthy and sad.


## Background

This game is built to experiment with some traditional game concepts such as players earning badges and progressing in the game through different levels. This sample also demonstrates how to create an  [Interactive Canvas](https://developers.google.com/actions/canvas/) experience using Actions on Google for the Google Assistant. It uses the [Node.js client library](https://github.com/actions-on-google/actions-on-google-nodejs) and is deployed on [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/) and [Firebase Hosting](https://firebase.google.com/docs/hosting). It also uses [FireStore](https://firebase.google.com/docs/firestore) to manage states across different devices as well as users.


## Core Classes

* Owner - This object models the user and maintains state relevant to the owner, e.g their name, etc
* Pet - An object that models the hamster which maintains state such as energy and happiness level of the hamster. Additionally, it contains logic related to the hamster like eating and playing.


## Setup Instructions

### Prerequisites

1. Node.js and NPM
   - We recommend installing using [nvm for Linux/Mac](https://github.com/creationix/nvm) and [nvm-windows for Windows](https://github.com/coreybutler/nvm-windows)
2. Install the [Firebase CLI](https://developers.google.com/actions/dialogflow/deploy-fulfillment)
   - We recommend using MAJOR version `7` with `7.1.1` or above, `npm install -g firebase-tools@^7.1.1`
   - Run `firebase login` with your Google account

### Configuration

#### Actions Console

1. From the [Actions on Google Console](https://console.actions.google.com/), add a new project > **Create Project** > under **More options** > **Conversational**
1. Click **Deploy** in the top menu. Then, click **Additional information**.
   1. Under **Category**, select **Games & fun**
   1. Under **Interactive Canvas** _Do your Actions use Interactive Canvas?_, check **Yes**
1. Click **Develop** in the top menu. Then, click **Actions** > **Add Your First Action** > **Play game** > **GET STARTED IN DIALOGFLOW** (this will bring you to the Dialogflow console) > Select language and time zone > **CREATE**.
1. In the Dialogflow console, go to **Settings** ⚙ > **Export and Import** > **Restore from zip** using the `agent.zip` in this sample's directory.

#### Firestore Database
1. From the [Firebase console](https://console.firebase.google.com), find and select your Actions on Google **Project ID**
1. In the left navigation menu under **Develop** section > **Database** > **Create database** button > Select **Start in test mode** > **Enable**

#### Firebase Deployment

1. On your local machine, in the `functions` directory, run `npm install`
   1. Note that when creating a new project for Interactive Canvas, you must install the `actions-on-google` library **Developer Preview** version using the `@preview` tag with `npm install actions-on-google@preview`.
1. Run `firebase deploy --project {PROJECT_ID}` to deploy the function and hosting
   - To find your **Project ID**: In [Dialogflow console](https://console.dialogflow.com/) under **Settings** ⚙ > **General** tab > **Project ID**.

#### Dialogflow Console

1. Return to the [Dialogflow Console](https://console.dialogflow.com) > select **Fulfillment** > **Enable** Webhook > Set **URL** to the **Function URL** that was returned after the deploy command > **SAVE**.
   ```
   https://${REGION}-${PROJECT_ID}.cloudfunctions.net/dialogflowFirebaseFulfillment
   ```
1. From the left navigation menu, click **Integrations** > **Integration Settings** under Google Assistant > Enable **Auto-preview changes** > **Test** to open the Actions on Google simulator then say or type `Talk to my test app`.

### Running this Sample

- You can test your Action on any Interactive Canvas [supported devices](https://developers.google.com/actions/interactivecanvas/#supported_devices) on which the Assistant is signed into the same account used to create this project. Just say or type, “OK Google, talk to my test app”.
- You can also use the Actions on Google Console simulator to test most features and preview on-device behavior.
- In the simulator, you have to click on the canvas iframe to enable audio playback of the game sounds.

## References & Issues

- Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google), [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/) or [Support](https://developers.google.com/actions/support/).
- For bugs, please report an issue on Github.
- Actions on Google [Interactive Canvas Documentation](https://developers.google.com/actions/canvas/)
- Actions on Google [Documentation](https://developers.google.com/actions/extending-the-assistant)
- Actions on Google [Codelabs](https://codelabs.developers.google.com/?cat=Assistant)
- [Webhook Boilerplate Template](https://github.com/actions-on-google/dialogflow-webhook-boilerplate-nodejs) for Actions on Google

## Make Contributions

Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).

## Terms

Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).