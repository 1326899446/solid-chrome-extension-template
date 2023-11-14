import {
  initAction,
  initedMode,
  initedSwitchStatus,
  initNativeFileContent,
  initWebviewContent
} from "../constant";
import { initNativeParams } from "./../constant";

// 数据初始化，如果状态这些状态没设置过，用默认值赋值
chrome.storage.sync.get(
  [
    "switch",
    "mode",
    "webviewParams",
    "actions",
    "nativeParams",
    "nativeFileContent",    
  ],
  ({
    switch: data,
    mode,
    actions,
    nativeParams,
    nativeFileContent,
  }) => {
    console.log(data,mode,actions,nativeParams,nativeFileContent);
    
    if (typeof data !== "boolean") {
      chrome.storage.sync.set({ switch: initedSwitchStatus });
    }
    if (!mode) {
      chrome.storage.sync.set({ mode: initedMode });
    }
    if (!actions || !Array.isArray(actions)) {
      chrome.storage.sync.set({ actions: initAction });
    }
    if (!nativeParams) {
      chrome.storage.sync.set({ nativeParams: initNativeParams });
    }
    if (!nativeFileContent) {
      chrome.storage.sync.set({ nativeFileContent: initNativeFileContent });
    }
  }
);
chrome.storage.local.get(["webviewParams"], ({ webviewParams }) => {
  if (!webviewParams) {
    chrome.storage.local.set({ webviewParams: initWebviewContent });
  }
});
