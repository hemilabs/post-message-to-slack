"use strict";

/**
 * Sends a message to a specified Slack webhook.
 *
 * @param {string} webHookUrl The Slack webhook post URL
 * @param {object} payload The payload to send i.e. `{ text: 'Hello World!" }`
 * @param {RequestInit} [options] Options to apply to the fetch request
 */
async function postMessageToSlack(webHookUrl, payload, options) {
  const res = await fetch(webHookUrl, {
    ...options,
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", ...options?.headers },
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to post to Slack: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

module.exports = postMessageToSlack;
