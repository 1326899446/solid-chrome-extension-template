import { setGlobal } from "./global";
export const initData = (constants) => {
  // 插件重新加载后，使用初始数据更新
  console.log("重新赋值数据");

  chrome.storage.sync.set({ app: constants.initedGlobal.app });
  chrome.storage.sync.set({ os: constants.initedGlobal.os });
  chrome.storage.sync.set({ status: constants.initedGlobal.status });
  chrome.storage.sync.set({
    loginStatus: constants.initedGlobal.loginStatus,
  });
  chrome.storage.sync.set({
    weakLoginStatus: constants.initedGlobal.weakLoginStatus,
  });
  chrome.storage.sync.set({ appParams: constants.initedGlobal.appParams });

  // 变量更新时更新全局变量
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log("变量更新-----", key, newValue);
      setGlobal(key, newValue);
    }
  });
};
