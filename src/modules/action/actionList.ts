import { initWebviewContent } from "@src/pages/background/constant";
import { getAction, parseUrl } from "@src/tools/utils";
// import { actions } from "../../../public/cft_action.js";
import { globalState } from "../data/global";
import { action10061 } from "./actions";

let actions = {};
// chrome.runtime.getURL("cft_actions.js")
// 动态引入外部js文件的方法
fetch("cft_action.js")
  .then((response) => response.text())
  .then((data) => {
    eval(data);
  })
  .catch((error) => console.error("Error:", error));

export const setTabWebviewParams = (tabId, params) => {
  chrome.storage.local.get(["webviewParams"], ({ webviewParams }) => {
    chrome.storage.local.set({
      webviewParams: {
        ...webviewParams,
        [tabId]: {
          ...initWebviewContent,
          ...params,
        },
      },
    });
  });
};
export const handleAction = (action, url: string, sender) => {
  const { origin } = sender;
  return new Promise((resolve, reject) => {
    switch (action) {
      case "10061": {
        action10061(url, origin);
        resolve("");
        break;
      }
      case "3413": {
        // 关闭当前
        const { tab } = sender;
        chrome.tabs.remove(tab.id);
        resolve("");
        break;
      }
      case "10090": {
        // 还有一个登录后跳转的问题
        // 有 url
        // 先判断登录状态
        if (globalState.loginStatus) {
          // 直接跳转且执行回调
          const params = parseUrl(url);
          const jsfuncname = params?.jsfuncname?.endsWith("()")
            ? params.jsfuncname.slice(0, -2)
            : params.jsfuncname;
          const url10090 = decodeURIComponent(params.url || "");
          if (url10090) {
            const action10090 = getAction(url10090);
            handleAction(action10090, url10090, sender);
          }
          resolve({
            jsfuncname,
            params: null,
          });
        } else {
          // 没登录，弹窗
          resolve({
            type: "openDialog",
            text: "即将强登录",
            accountType: 0,
            url,
          });
        }

        break;
      }
      case "10092": {
        // 还有一个登录后跳转的问题
        // 有 url
        // 先判断登录状态
        if (globalState.weakLoginStatus) {
          // 直接跳转且执行回调
          const params = parseUrl(url);
          const jsfuncname = params?.jsfuncname?.endsWith("()")
            ? params.jsfuncname.slice(0, -2)
            : params.jsfuncname;
          const url10092 = decodeURIComponent(params.url || "");
          if (url10092) {
            const action10092 = getAction(url10092);
            handleAction(action10092, url10092, sender);
          }
          resolve({
            jsfuncname,
            params: null,
          });
        } else {
          resolve({
            type: "openDialog",
            text: "即将弱登录",
            accountType: 1,
            url,
          });
        }
        break;
      }
      default: {
        const params = parseUrl(url);
        const jsfuncname = params?.jsfuncname || "";
        const actionHandler = actions[action];
        if (typeof actionHandler === "function") {
          // TODO 明天把参数传进去
          resolve({
            jsfuncname,
            params: actionHandler(params),
          });
        } else {
          resolve({
            jsfuncname,
            params: actionHandler,
          });
        }
      }
    }
  });
};
