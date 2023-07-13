export const store = {
  activated: false,
};

(function initStore() {
  chrome.storage.sync.get(["activated"], function (result) {
    console.log(`Value currently is ${result.activated}`);
    store.activated = result.activated;
  });
})()
