import './message';

const setIcon = () =>
  chrome.action.setIcon({
    path: {
      "16": `icons/icon${active ? "-grey" : ""}-16.png`,
      "48": `icons/icon${active ? "-grey" : ""}-48.png`,
      "128": `icons/icon${active ? "-grey" : ""}-128.png`,
    },
  });

chrome.runtime.onInstalled.addListener(() => {
  setIcon();
});

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  console.log(tab);
  // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
  // Next state will always be the opposite
  active = !active;
  setIcon();

  // Set the action badge to the next state
  chrome.storage.sync.set({ active: active }, function () {
    console.log(`Value is set to ${active}`);
  });
});
