import { handleAction } from "./action";
import { sendMessageToContent } from "./utils";
let index = true;
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const { url: oriUrl, initiator } = details;
    const url = decodeURIComponent(oriUrl);

    console.log(url, initiator);
    if (url === "https://www.baidu.com/" && index) {
      index = false;
      chrome.tabs.create({ url: `https://www.baidu.com` });
      return { redirectUrl: "https://www.baiduaaa.com" };
    }

    return { cancel: true };
    if (url.includes("http://action") || url.includes("action:")) {
      const reg = /action:(\d+)/gi;
      const action = reg.exec(url)?.[1];
      handleAction(action, url, initiator);
    } else if (url === "https://__bridge_loaded__/") {
      // 向 content 发送加载 script消息
      sendMessageToContent({
        action: "load",
        payload: "bridge/ios_bridge.js",
      });
      return { redirectUrl: "javascript:" };
      // 应该是 ios 特有的，是bridge的真正执行脚本，会在window上挂载 WebViewJavascriptBridge
    }
    console.log("wwwwwwwwwwwwwwwwww");

    //
  },
  { urls: ["<all_urls>"] }
);
