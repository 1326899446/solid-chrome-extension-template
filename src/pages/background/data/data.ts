export const global:Record<string,any> = {};
export const setGlobal = (key, value) => {
  global[key] = value;
};
// 项目启动时从 sync 获取数据
chrome.storage.sync.get(
  ["switch", "mode", "actions", "nativeParams", "nativeFileContent","weakAccountStatus",'accountStatus'],
  ({ switch: data, mode, actions, nativeParams, nativeFileContent,weakAccountStatus, accountStatus}) => {
    setGlobal("switch", data);
    setGlobal("mode", mode);
    setGlobal("actions", actions);
    setGlobal("nativeParams", nativeParams);
    setGlobal("nativeFileContent", nativeFileContent);
    setGlobal("weakAccountStatus", weakAccountStatus);
    setGlobal("accountStatus", accountStatus);
  }
);
// 数据变化时更新全局变量
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    setGlobal(key, newValue);
    console.log("变量更新-----",key, newValue);
  }
});
