<a  href="https://www.twilio.com">
<img  src="https://github.com/mvrzan/flex-keyboard-shortcuts/assets/53003989/5158eaee-9cef-4a8d-bf08-937a2286e04c"  alt="Twilio"  width="250"  />
</a>

# Internal Agent Chat

Twilio Flex plugin that enables contact center users to chat with one another within the Flex user interface by leveraging the Conversations API.

# Table of Contents

- [Internal Agent Chat](#internal-agent-chat)
- [Table of Contents](#table-of-contents)
  - [What does it do?](#what-does-it-do)
  - [How does this work?](#how-does-this-work)
    - [How are you persisting pinned chats between refreshes?](#how-are-you-persisting-pinned-chats-between-refreshes)
  - [Known Issues](#known-issues)
  - [Remaining work items](#remaining-work-items)
  - [Development](#development)
- [Configuration](#configuration)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Flex Plugin](#flex-plugin)
    - [Development](#development-1)
    - [Deploy your Flex Plugin](#deploy-your-flex-plugin)
  - [License](#license)
  - [Disclaimer](#disclaimer)

---

## What does it do?

The _Internal Agent Chat_ introduces an ability for Flex agents to communicate together within the Flex user interface without the need for a 3rd party software.

## How does this work?

In order to create a Conversation for the Internal Agent Chat, specific Conversation roles' permissions have to be updated. Specifically, the `admin` `service` role's permissions have to be elevated to allow for `createConversation` permission.

The Internal Agent Chat plugin works by tapping into the [JavaScript Conversations SDK](https://sdk.twilio.com/js/conversations/releases/2.5.0/docs/index.html) which is available through Flex and which Flex already uses for its messaging capabilities.

A custom UI is loaded into Flex that taps into the [insightsClient](https://www.twilio.com/docs/flex/developer/ui/v1/manager#insightsclient) to get a list of Flex agents. Once a user selects and agent and sends a message, a custom Conversation will be created (and tagged with a custom attribute for filtering).

This plugin DOES NOT create Tasks in the Taskrouter and it also DOES NOT affect Flex Insights reporting. Therefore, the chats that agents have are completely isolated from reporting and their normal day-to-day operations.

It is important to mention that this plugin does not have a serverless backend, meaning, there are no Twilio Functions involved for the operation of this plugin. While this comes with simpler deployment options, it also introduces a limitation which is the [insightsClient](https://www.twilio.com/docs/flex/developer/ui/v1/manager#insightsclient). The insightsClient has a limit of 200 workers at any given time. Also, Agents would have had to log into Flex in the past 30 days for the insightsClient to pick them up.

The plugin is available to both agents and supervisors alike and it allows the following functionalities:

**View default Flex keyboard shortcuts:**

<img width="100%" src="./screenshots/default-keyboard-shortcuts.png"/>

This view allows users to see the default Flex keyboard shortcuts and their current mappings.

**View custom Flex keyboard shortcuts**

<img width="100%" src="./screenshots/custom-keyboard-shortcuts.png"/>

This view allows users to see custom added keyboard shortcuts and their current mappings.

**A settings screen for easy management**

![](./screenshots/settings.gif)

**Delete shortcuts**

![](./screenshots/delete-shortcuts.gif)

**Remap a shortcut**

![](./screenshots/remap-shortcut.gif)

**Adjust key throttling**

![](./screenshots/key-throttling.gif)

**Disable keyboard shortcuts**

![](screenshots/disable-shortcuts.gif)

**Reset keyboard shortcuts to default values**

![](./screenshots/reset-shortcuts.gif)

### How are you persisting pinned chats between refreshes?

Pinned chats are stored into browser local storage and read during plugin initialization.

## Known Issues

There is a bug where multiple attachmenets will not be recognized if they are a combinaton of a standard upload and Drag & Drop option.

## Remaining work items

Since this plugin was in progress when I got laid off from Twilio, there are a lot of unfinished work here. Here is a list of potential items to implement into the plugin:

1. User feedback in case you are unable to create new Conversations. Right now if you are unable to create a conversation, the error will be displayed in the console and that is it. My plan was to add additional user feedback throughout the plugin to have a nicer user experience.
2. IMPORTANT: There is no Conversation clean up process in place. What this means is that Flex agents are able to create new [Conversations](https://www.twilio.com/docs/conversations) just by finding an Agent to chat. An Agent can be a member of 1000 Conversations before they are prevented from joining additional Conversations. Depending on your workload, you may not hit this limit, but regardless, a proper clean up process needs to be implemented.

## Development

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

# Configuration

## Requirements

To deploy this plugin, you will need:

- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project%22) to create one.
- Flex version 2.1 or above
- npm version 5.0.0 or later installed (type `npm -v` in your terminal to check)
- Node.js version 12 or later installed (type `node -v` in your terminal to check). _Even_ versions of Node are. **Note:** In order to install Twilio Flex CLI plugin that is needed for locally running Flex, Node version 16 is the latest supported version (if you are using Node 18., please revert back or use Node Version Manager).
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)
- Once the Twilio CLI and Twilio Flex CLI plugins are successfully installed, configure your [Twilio CLI profile](https://www.twilio.com/docs/twilio-cli/general-usage). **Note:** This step is required if you are running Twilio CLI for the first time or if you have multiple Twilio CLI profiles configured.

## Setup

Install the dependencies by running `npm install`:

```bash
cd flex-internal-agent-chat
npm install
```

From the root directory, rename `public/appConfig.example.js` to `public/appConfig.js`.

```bash
mv public/appConfig.example.js public/appConfig.js
```

## Flex Plugin

### Development

To run the plugin locally, you can use the Twilio Flex CLI plugin. Using your command line, run the following from the root directory of the plugin.

```bash
cd flex-internal-agent-chat
twilio flex:plugins:start
```

This will automatically start up the webpack dev server and open the browser for you. Your app will run on `http://localhost:3000`.

When you make changes to your code, the browser window will be automatically refreshed.

### Deploy your Flex Plugin

Once you are happy with your Flex plugin, you have to deploy then release it on your Flex application.

Run the following command to start the deployment:

```bash
twilio flex:plugins:deploy --major --changelog "Releasing Internal Agent Chat" --description "Interanl Agent Chat"
```

After running the suggested next step, navigate to the [Plugins Dashboard](https://flex.twilio.com/admin/) to review your recently deployed plugin and confirm that it’s enabled for your contact center.

Additionally, it is also possible to create a relase using the Twilio CLI as described [here](https://www.twilio.com/docs/flex/developer/plugins/cli/deploy-and-release#creating-a-new-release).

```bash
twilio flex:plugins:release --plugin internal-agent-chat@1.0.0 --name "Autogenerated Release 1679673397275" --description "Internal Agent Chat for Flex"
```

**Note:** Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

You are all set to test this plugin on your Flex application!

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.
