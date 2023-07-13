let active = false;

export function getActivated() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["active"], function (result) {
      console.log(`Value currently is ${result.key}`);
      active = result.key;
    });
  });
}
