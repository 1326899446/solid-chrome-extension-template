import { globalState } from '../data/global';
chrome.runtime.onMessageExternal.addListener(
  async (message, sender, sendResponse) => {
    globalState.handleActionRemote?.(message, sender, sendResponse,globalState);
  }
);
