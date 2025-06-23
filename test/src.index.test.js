"use strict";

const { test } = require("node:test");
const assert = require("node:assert").strict;

const postMessageToSlack = require("..");

function mockFetch(response, options = {}) {
  return function fetchMock() {
    if (options.shouldReject) {
      return Promise.reject(options.rejectWith || new Error("Network error"));
    }
    return Promise.resolve({
      headers: options.headers || {},
      json: () =>
        options.invalidJson
          ? Promise.reject(new Error("Invalid JSON"))
          : Promise.resolve(response),
      ok: options.ok !== false,
      status: options.status || 200,
      statusText: options.statusText || "ok",
      text: () => Promise.resolve(response),
    });
  };
}

function withMockedFetch(mock, fn) {
  const originalFetch = global.fetch;
  global.fetch = mock;
  return fn().finally(function () {
    global.fetch = originalFetch;
  });
}

test("successfully posts message to Slack", async function () {
  await withMockedFetch(mockFetch("ok", { ok: true }), async function () {
    const result = await postMessageToSlack(
      "https://hooks.slack.com/services/xxx",
      { text: "Hello" },
    );
    assert.equal(result, "ok");
  });
});

test("throws error when fetch fails (network error)", async function () {
  await withMockedFetch(
    mockFetch(null, { shouldReject: true }),
    async function () {
      await assert.rejects(
        () =>
          postMessageToSlack("https://hooks.slack.com/services/xxx", {
            text: "Hello",
          }),
        /Network error/,
      );
    },
  );
});

test("throws error when response is not ok", async function () {
  await withMockedFetch(
    mockFetch("fail", { ok: false, status: 400, statusText: "Bad Request" }),
    async function () {
      await assert.rejects(
        () =>
          postMessageToSlack("https://hooks.slack.com/services/xxx", {
            text: "Hello",
          }),
        /Failed to post to Slack: 400 Bad Request/,
      );
    },
  );
});

test("merges custom headers and options", async function () {
  let fetchCalled = false;
  function customFetch(url, opts) {
    fetchCalled = true;
    assert.equal(opts.method, "POST");
    assert.deepEqual(JSON.parse(opts.body), { text: "Hello" });
    assert.equal(opts.headers["Content-Type"], "application/json");
    assert.equal(opts.headers["X-Test"], "1");
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: "ok",
      text: () => Promise.resolve("ok"),
    });
  }
  await withMockedFetch(customFetch, async function () {
    const result = await postMessageToSlack(
      "https://hooks.slack.com/services/xxx",
      { text: "Hello" },
      { headers: { "X-Test": "1" } },
    );
    assert.equal(result, "ok");
    assert.ok(fetchCalled);
  });
});
