# post-message-to-slack

Small utility wrapper around fetch to POST to Slack incoming webhooks.

## Requirements

- Node.js 18+ (or any environment with `fetch` available)

## Install

```sh
npm install post-message-to-slack
```

## Usage

```js
const postMessageToSlack = require("post-message-to-slack");

const webhookUrl = "https://hooks.slack.com/services/...";
await postMessageToSlack(webhookUrl, { text: "Hello <!here>!" });
```

## API

### `postMessageToSlack(webhookUrl, payload, options)`

Posts the message (payload) to the proper Slack incoming webhook URL.

- Throws an error if the request fails or the response is not 2xx.
- Returns a `Promise` with the response on success.

#### `webhookUrl`

Type: `string`  
The URL of the incoming webhook.

#### `payload`

Type: `object`  
The payload representing the message to post. See the docs on [Sending messages using incoming webhooks](https://api.slack.com/messaging/webhooks#advanced_message_formatting).

#### `options`

Type: `RequestInit`  
Additional settings to apply to the request.
